from app.rag.retriever import get_retriever
from app.rag.prompts import get_chat_prompt
from app.rag.llm import get_llm

from app.rag.memory import (
    get_chat_history,
    add_message
)


def format_chat_history(
    history: list
) -> str:

    if not history:
        return "No previous conversation."

    formatted_history = []

    for message in history:

        role = message["role"]
        content = message["content"]

        if role == "human":

            formatted_history.append(
                f"Human: {content}"
            )

        elif role == "ai":

            formatted_history.append(
                f"AI: {content}"
            )

    return "\n".join(
        formatted_history
    )


def format_context(
    documents: list
) -> str:

    if not documents:
        return "No relevant context found."

    context = []

    for document in documents:

        context.append(
            document.page_content
        )

    return "\n\n".join(
        context
    )


def format_sources(
    documents: list
) -> list:

    sources = []

    for document in documents:

        sources.append(
            {
                "content": document.page_content,
                "source": document.metadata.get(
                    "source"
                ),
                "page": document.metadata.get(
                    "page"
                ),
                "document_id": document.metadata.get(
                    "document_id"
                )
            }
        )

    return sources


async def ask_question(
    session_id: str,
    question: str
):

    # -------------------------------
    # 1. Create session-specific retriever
    # -------------------------------

    retriever = get_retriever(
        session_id
    )


    # -------------------------------
    # 2. Retrieve relevant documents
    # -------------------------------

    documents = await retriever.ainvoke(
        question
    )


    # -------------------------------
    # 3. Get chat history
    # -------------------------------

    history = await get_chat_history(
        session_id=session_id
    )


    # -------------------------------
    # 4. Format retrieved context
    # -------------------------------

    context = format_context(
        documents
    )


    # -------------------------------
    # 5. Format conversation history
    # -------------------------------

    chat_history = format_chat_history(
        history
    )


    # -------------------------------
    # 6. Create prompt
    # -------------------------------

    prompt = get_chat_prompt()

    messages = await prompt.ainvoke(
        {
            "context": context,
            "chat_history": chat_history,
            "question": question
        }
    )


    # -------------------------------
    # 7. Get LLM
    # -------------------------------

    llm = get_llm()


    # -------------------------------
    # 8. Generate answer
    # -------------------------------

    response = await llm.ainvoke(
        messages
    )

    answer = response.content


    # -------------------------------
    # 9. Save user message
    # -------------------------------

    await add_message(
        session_id=session_id,
        role="human",
        content=question
    )


    # -------------------------------
    # 10. Save AI response
    # -------------------------------

    await add_message(
        session_id=session_id,
        role="ai",
        content=answer
    )


    # -------------------------------
    # 11. Format sources
    # -------------------------------

    sources = format_sources(
        documents
    )


    # -------------------------------
    # 12. Return result
    # -------------------------------

    return {
        "answer": answer,
        "sources": sources
    }