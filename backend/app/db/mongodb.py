from pymongo import AsyncMongoClient

from app.config.settings import settings


DATABASE_NAME = "rag_application"
CHAT_COLLECTION_NAME = "chat_history"


client = AsyncMongoClient(settings.MONGODB_URI)

database = client[DATABASE_NAME]

chat_collection = database[CHAT_COLLECTION_NAME]


async def connect_mongodb():
    """Check the MongoDB connection."""

    await client.admin.command("ping")

    print("MongoDB connected successfully.")


async def close_mongodb():
    """Close the MongoDB connection."""

    await client.close()


def get_chat_collection():
    """Return the chat history collection."""

    return chat_collection