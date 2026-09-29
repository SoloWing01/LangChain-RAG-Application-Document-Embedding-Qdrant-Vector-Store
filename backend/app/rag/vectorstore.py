from qdrant_client import QdrantClient
from qdrant_client.http.models import (
    Distance,
    VectorParams,
    PayloadSchemaType
)
from langchain_qdrant import QdrantVectorStore

from app.config.settings import settings
from app.rag.embeddings import get_embedding


COLLECTION_NAME = "rag_application"
VECTOR_SIZE = 384


def get_qdrant_client():

    client = QdrantClient(
        url=settings.QDRANT_URL,
        api_key=settings.QDRANT_API_KEY
    )

    return client


def ensure_collection(client):

    if not client.collection_exists(COLLECTION_NAME):

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )


def ensure_payload_index(client):

    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="metadata.session_id",
        field_schema=PayloadSchemaType.KEYWORD
    )


def create_vector_store():

    client = get_qdrant_client()

    ensure_collection(client)
    ensure_payload_index(client)

    vector_store = QdrantVectorStore(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding=get_embedding()
    )

    return vector_store


def add_documents(chunks, session_id: str):

    vector_store = create_vector_store()

    for chunk in chunks:

        chunk.metadata["session_id"] = session_id

    vector_store.add_documents(chunks)

    return vector_store