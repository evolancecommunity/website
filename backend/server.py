import logging
import os
import uuid
from datetime import datetime
from pathlib import Path
from typing import List

import requests
from dotenv import load_dotenv
from fastapi import APIRouter, FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

# MongoDB connection
mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

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
    _ = await db.status_checks.insert_one(status_obj.dict())
    return status_obj


@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**status_check) for status_check in status_checks]


# Waitlist endpoints
@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(input: WaitlistEntryCreate):
    entry_dict = input.dict()
    entry_obj = WaitlistEntry(**entry_dict)
    await db.waitlist.insert_one(entry_obj.dict())
    return entry_obj


@api_router.get("/waitlist", response_model=List[WaitlistEntry])
async def get_waitlist_entries():
    entries = await db.waitlist.find().to_list(1000)
    return [WaitlistEntry(**entry) for entry in entries]


@api_router.get("/waitlist/count")
async def get_waitlist_count():
    count = await db.waitlist.count_documents({})
    return {"count": count}


@api_router.get("/emailjs/contacts/count")
async def get_emailjs_contacts_count():
    """Return number of contacts stored in EmailJS."""
    api_key = os.getenv("EMAILJS_API_KEY")
    account_id = os.getenv("EMAILJS_ACCOUNT_ID")
    if not api_key or not account_id:
        logging.error("EmailJS credentials not configured")
        return {"count": 0}

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
        return {"count": 0}


@api_router.delete("/waitlist")
async def clear_waitlist():
    result = await db.waitlist.delete_many({})
    return {"deleted": result.deleted_count}


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
