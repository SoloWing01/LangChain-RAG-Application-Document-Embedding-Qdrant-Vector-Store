from langchain_mistralai import ChatMistralAI
from app.config.settings import settings


def get_llm():
    llm = ChatMistralAI(model=settings.MISTRAL_MODEL,api_key=settings.MISTRAL_API_KEY,temperature=0)
    return llm