from pydantic import BaseModel, Field


class ChatRequest(BaseModel):

    session_id: str = Field(
        min_length=1
    )

    question: str = Field(
        min_length=1
    )


class ChatResponse(BaseModel):

    answer: str

    sources: list