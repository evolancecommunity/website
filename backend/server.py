from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime
import json
import requests
from pymongo.errors import CollectionInvalid

# Setup
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get("MONGO_URL")
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[os.environ["DB_NAME"]] if client else None

# Waitlist fallback file
WAITLIST_FILE = ROOT_DIR / "waitlist.json"

# App
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class WaitlistEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

class WaitlistEntryCreate(BaseModel):
    name: str
    email: str

# Logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@api_router.get("/")
async def root():
    logger.info("Root endpoint called")
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    logger.info("Create status check: %s", input.dict())
    status_obj = StatusCheck(**input.dict())
    if db:
        await db.status_checks.insert_one(status_obj.dict())
        logger.info("Saved to DB: %s", status_obj.id)
        return status_obj
    raise HTTPException(status_code=503, detail="Database not configured")

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**s) for s in status_checks]

def _load_waitlist() -> List[dict]:
    if WAITLIST_FILE.exists():
        try:
            return json.loads(WAITLIST_FILE.read_text())
        except Exception as exc:
            logger.error("Error loading waitlist: %s", exc)
    return []

def _save_waitlist(entries: List[dict]) -> None:
    WAITLIST_FILE.write_text(json.dumps(entries, default=str, indent=2))

@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(input: WaitlistEntryCreate):
    logger.info("Create waitlist entry: %s", input.dict())
    entry_obj = WaitlistEntry(**input.dict())
    if db is None:
        await db.waitlist.insert_one(entry_obj.dict())
        logger.info("Saved to DB: %s", entry_obj.id)
    else:
        data = _load_waitlist()
        data.append(entry_obj.dict())
        _save_waitlist(data)
    return entry_obj

@api_router.get("/waitlist", response_model=List[WaitlistEntry])
async def get_waitlist_entries():
    if db:
        entries = await db.waitlist.find().to_list(1000)
    else:
        entries = _load_waitlist()
    return [WaitlistEntry(**e) for e in entries]

@api_router.get("/waitlist/count")
async def get_waitlist_count():
    if db:
        count = await db.waitlist.count_documents({})
    else:
        count = len(_load_waitlist())
    return {"count": count}

@api_router.get("/emailjs/contacts/count")
async def get_emailjs_contacts_count():
    api_key = os.getenv("EMAILJS_API_KEY")
    account_id = os.getenv("EMAILJS_ACCOUNT_ID")

    if not api_key or not account_id:
        logger.error("EmailJS creds not found")
        return {"count": len(_load_waitlist())}

    try:
        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }
        url = f"https://api.emailjs.com/api/v1/accounts/{account_id}/contacts"
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return {"count": len(data.get("contacts", []))}
    except Exception as exc:
        logger.error("EmailJS contact fetch failed: %s", exc)
        return {"count": len(_load_waitlist())}

@api_router.delete("/waitlist")
async def clear_waitlist():
    if db:
        result = await db.waitlist.delete_many({})
        return {"deleted": result.deleted_count}
    _save_waitlist([])
    return {"deleted": 0}

# Attach router
app.include_router(api_router)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()

@app.get("/")
def root():
    return {"message": "Backend is live!"}
@api_router.get("/db/ping")
async def ping_database():
    if db is None:
        raise HTTPException(status_code=503, detail="Database not configured")
    try:
        collections = await db.list_collection_names()
        return {"status": "connected", "collections": collections}
    except Exception as e:
        logger.error(f"MongoDB connection error: {e}")
        raise HTTPException(status_code=500, detail="MongoDB connection failed")

# New startup check: create 'waitlist' collection if not present
async def check_and_create_collections():
    if db is None:
        logger.error("No database connection found.")
        return

    existing_collections = await db.list_collection_names()
    if "waitlist" not in existing_collections:
        try:
            await db.create_collection("waitlist", validator={
                "$jsonSchema": {
                    "bsonType": "object",
                    "required": ["id", "name", "email", "created_at"],
                    "properties": {
                        "id": {"bsonType": "string"},
                        "name": {"bsonType": "string"},
                        "email": {"bsonType": "string"},
                        "created_at": {"bsonType": "date"}
                    }
                }
            })
            logger.info("Created 'waitlist' collection with schema validation.")
        except CollectionInvalid as e:
            logger.warning(f"Collection creation failed: {e}")
    else:
        logger.info("'waitlist' collection already exists.")

@app.on_event("startup")
async def startup_db_check():
    await check_and_create_collections()

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=False)
