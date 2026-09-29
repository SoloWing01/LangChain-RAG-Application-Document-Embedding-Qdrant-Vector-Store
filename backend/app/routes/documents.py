import asyncio
import os
import tempfile
import uuid

from fastapi import APIRouter, File, Form, HTTPException, UploadFile

from app.schemas.document import DocumentUploadResponse
from app.services.document_loader import load_document
from app.rag.splitter import split_documents
from app.rag.vectorstore import add_documents


router = APIRouter(
    prefix="/api/documents",
    tags=["Documents"]
)


ALLOWED_EXTENSIONS = {".pdf", ".docx"}


@router.post(
    "/upload",
    response_model=DocumentUploadResponse
)
async def upload_document(
    session_id: str = Form(...),
    file: UploadFile = File(...)
):
    # -----------------------------
    # 1. Validate session ID
    # -----------------------------
    if not session_id.strip():
        raise HTTPException(
            status_code=400,
            detail="session_id cannot be empty."
        )

    # -----------------------------
    # 2. Validate file
    # -----------------------------
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was provided."
        )

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type. Only PDF and DOCX files are allowed."
        )

    # -----------------------------
    # 3. Generate document ID
    # -----------------------------
    document_id = str(uuid.uuid4())

    temp_path = None

    try:
        # -----------------------------
        # 4. Save uploaded file
        # -----------------------------
        file_content = await file.read()

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:
            temp_file.write(file_content)
            temp_path = temp_file.name

        # -----------------------------
        # 5. Load document
        # -----------------------------
        documents = await asyncio.to_thread(
            load_document,
            temp_path
        )

        # -----------------------------
        # 6. Split document
        # -----------------------------
        chunks = await asyncio.to_thread(
            split_documents,
            documents,
            1000,
            100
        )

        if not chunks:
            raise HTTPException(
                status_code=400,
                detail="No readable content was found in the document."
            )

        # -----------------------------
        # 7. Add metadata
        # -----------------------------
        for index, chunk in enumerate(chunks):

            chunk.metadata["session_id"] = session_id
            chunk.metadata["document_id"] = document_id
            chunk.metadata["source"] = file.filename
            chunk.metadata["chunk_index"] = index
            chunk.metadata["content_type"] = "text"

        # -----------------------------
        # 8. Store embeddings in Qdrant
        # -----------------------------
        await asyncio.to_thread(
            add_documents,
            chunks,
            session_id
        )

        # -----------------------------
        # 9. Return response
        # -----------------------------
        return DocumentUploadResponse(
            message="Document uploaded and processed successfully.",
            document_id=document_id,
            filename=file.filename
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process document: {str(e)}"
        )

    finally:
        # -----------------------------
        # 10. Delete temporary file
        # -----------------------------
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)