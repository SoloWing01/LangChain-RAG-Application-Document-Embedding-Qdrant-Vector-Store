from datetime import datetime, timedelta, timezone

from app.db.mongodb import get_chat_collection


MAX_MESSAGES = 20
MEMORY_TTL_MINUTES = 60


async def create_memory_index():

    collection = get_chat_collection()

    await collection.create_index(
        "expires_at",
        expireAfterSeconds=0
    )

    await collection.create_index(
        [
            ("session_id", 1),
            ("created_at", 1)
        ]
    )


async def add_message(
    session_id: str,
    role: str,
    content: str
):

    collection = get_chat_collection()

    now = datetime.now(timezone.utc)

    expires_at = now + timedelta(
        minutes=MEMORY_TTL_MINUTES
    )

    message = {
        "session_id": session_id,
        "role": role,
        "content": content,
        "created_at": now,
        "expires_at": expires_at
    }

    await collection.insert_one(message)


async def get_chat_history(
    session_id: str,
    limit: int = MAX_MESSAGES
):

    collection = get_chat_collection()

    cursor = (
        collection
        .find(
            {
                "session_id": session_id
            },
            {
                "_id": 0,
                "role": 1,
                "content": 1,
                "created_at": 1
            }
        )
        .sort(
            "created_at",
            1
        )
        .limit(limit)
    )

    history = await cursor.to_list(
        length=limit
    )

    return history


async def clear_chat_history(
    session_id: str
):

    collection = get_chat_collection()

    await collection.delete_many(
        {
            "session_id": session_id
        }
    )