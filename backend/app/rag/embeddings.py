from langchain_huggingface import HuggingFaceEndpointEmbeddings
from app.config.settings import settings
def get_embedding():
    embedding=HuggingFaceEndpointEmbeddings(model=settings.HUGGINGFACE_EMBEDDING_MODEL,huggingfacehub_api_token=settings.HUGGINGFACE_API_KEY)
    return embedding