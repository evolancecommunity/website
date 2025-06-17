import json
import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List

try:
    import requests  # type: ignore
except Exception:  # pragma: no cover - optional dependency
    requests = None

from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI, HTTPException
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection (optional)
mongo_url = os.getenv("MONGO_URL")
db_name = os.getenv("DB_NAME", "evolance")
client = AsyncIOMotorClient(mongo_url) if mongo_url else None
db = client[db_name] if client else None

WAITLIST_FILE = ROOT_DIR / "waitlist.json"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class StatusCheckCreate(BaseModel):
    client_name: str


# Waitlist models
class WaitlistEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    first_name: str
    last_name: str
    email: EmailStr
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class WaitlistEntryCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr


# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}


@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.dict()
    status_obj = StatusCheck(**status_dict)
    if db:
        await db.status_checks.insert_one(status_obj.dict())
        return status_obj
    raise HTTPException(status_code=503, detail="Database not configured")


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    if not db:
        raise HTTPException(status_code=503, detail="Database not configured")
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# Waitlist endpoints
def _load_waitlist() -> List[dict]:
    if WAITLIST_FILE.exists():
        try:
            return json.loads(WAITLIST_FILE.read_text())
        except Exception:
            return []
    return []


def _save_waitlist(entries: List[dict]) -> None:
    """Persist waitlist entries to the JSON file."""
    WAITLIST_FILE.write_text(json.dumps(entries, default=str, indent=2))


@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(input: WaitlistEntryCreate):
    entry_obj = WaitlistEntry(**input.dict())
    if db:
        await db.waitlist.insert_one(entry_obj.dict())
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
    return [WaitlistEntry(**entry) for entry in entries]


@api_router.get("/waitlist/count")
async def get_waitlist_count():
    if db:
        count = await db.waitlist.count_documents({})
    else:
        count = len(_load_waitlist())
    return {"count": count}


@api_router.get("/emailjs/contacts/count")
async def get_emailjs_contacts_count():
    """Return number of contacts stored in EmailJS."""
    api_key = os.getenv("EMAILJS_API_KEY")
    account_id = os.getenv("EMAILJS_ACCOUNT_ID")
    if not api_key or not account_id:
        logging.error("EmailJS credentials not configured")
        return {"count": len(_load_waitlist())}

    if requests is None:
        logging.error("requests library not installed")
        return {"count": len(_load_waitlist())}

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }
    url = f"https://api.emailjs.com/api/v1/accounts/{account_id}/contacts"
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        return {"count": len(data.get("contacts", []))}
    except Exception as exc:
        logging.error("Failed fetching EmailJS contacts: %s", exc)
        return {"count": len(_load_waitlist())}


@api_router.delete("/waitlist")
async def clear_waitlist():
    if db:
        result = await db.waitlist.delete_many({})
        deleted = result.deleted_count
    else:
        _save_waitlist([])
        deleted = 0
    return {"deleted": deleted}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
