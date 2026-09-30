# RAG Atelier --- V1.0

A document-based Retrieval-Augmented Generation (RAG) application that
lets users upload PDF and DOCX documents, generate embeddings, store
them in Qdrant, and ask questions using retrieved document context.

V1.0 focuses on building a complete end-to-end RAG pipeline and deploying
it as a working full-stack application.

## Live Application

**Live Demo:**\
https://lang-chain-rag-application-document.vercel.app/

**GitHub Repository:**\
https://github.com/SoloWing01/LangChain-RAG-Application-Document-Embedding-Qdrant-Vector-Store

**Backend API:**\
https://langchain-rag-application-document.onrender.com/

## V1.0 Status

**Version 1 --- Completed and Live**

The project is being developed incrementally through multiple versions.

-   **V1.0:** Core RAG pipeline and production deployment --- Completed
-   **V2:** Persistent users, conversations, and document management ---
    Planned/In Progress
-   **Future versions:** Advanced RAG features and further improvements

------------------------------------------------------------------------

## Overview

RAG Atelier combines document retrieval with a large language model to
produce answers grounded in the documents uploaded by the user.

Instead of sending a question directly to an LLM, the application
follows this process:

``` text
User uploads document
        ↓
Document loading
        ↓
Text splitting
        ↓
Hugging Face embeddings
        ↓
Qdrant vector store
        ↓
User asks a question
        ↓
Relevant document chunks retrieved
        ↓
Retrieved context + question
        ↓
Mistral LLM
        ↓
Grounded answer + sources
```

------------------------------------------------------------------------

## Features

### Document Upload

Users can upload:

-   PDF files
-   DOCX files

The backend validates the file type before processing it.

### Document Processing

Uploaded documents are:

1.  Loaded
2.  Split into smaller chunks
3.  Enriched with metadata
4.  Converted into embeddings
5.  Stored in Qdrant

The current text-splitting configuration uses:

``` text
Chunk size: 1000
Chunk overlap: 100
```

### Hugging Face Embeddings

The application uses a Hugging Face embedding model through
`HuggingFaceEndpointEmbeddings`.

The embedding dimension used by the Qdrant collection is:

``` text
384
```

The embedding model is configurable through the backend environment
settings.

### Qdrant Vector Store

Qdrant is used to store and retrieve document embeddings.

Document metadata includes:

-   `session_id`
-   `document_id`
-   `source`
-   `chunk_index`
-   `content_type`

This provides the foundation for session-level document retrieval.

### Mistral LLM

Mistral is used to generate the final response based on the retrieved
document context.

The Mistral model is configurable through the backend environment
settings.

### Bring Your Own API Keys

V1.0 uses a BYOK (Bring Your Own Key) approach.

Users provide their own:

-   Hugging Face API key
-   Mistral API key

The frontend keeps these keys in the current browser session and sends
them with the relevant requests.

The application does not require the project owner to provide a shared
model API key to every user.

### Conversation Memory

MongoDB is used for short-term chat memory.

Messages contain:

-   `session_id`
-   `role`
-   `content`
-   `created_at`
-   `expires_at`

A TTL index automatically removes expired messages.

Current memory configuration:

``` text
Maximum messages: 20
Memory lifetime: 60 minutes
```

### Source Retrieval

The chat response can include retrieved source information such as:

-   Source document
-   Page number when available
-   Retrieved content

This makes the generated response easier to trace back to the uploaded
document.

### API Documentation

The FastAPI backend provides automatically generated Swagger
documentation.

``` text
/docs
```

------------------------------------------------------------------------

## Tech Stack

### Frontend

-   Next.js
-   React
-   TypeScript
-   CSS
-   Vercel

### Backend

-   Python
-   FastAPI
-   Uvicorn
-   Render

### RAG / AI

-   LangChain
-   Hugging Face
-   Mistral
-   Qdrant

### Database

-   MongoDB Atlas

### Document Processing

-   PyPDF
-   python-docx
-   LangChain document loaders
-   Recursive character text splitting

------------------------------------------------------------------------

## Project Structure

``` text
LangChain-RAG-Application-Document-Embedding-Qdrant-Vector-Store/
│
├── backend/
│   ├── app/
│   │   ├── config/
│   │   │   └── settings.py
│   │   │
│   │   ├── db/
│   │   │   └── mongodb.py
│   │   │
│   │   ├── rag/
│   │   │   ├── chain.py
│   │   │   ├── embeddings.py
│   │   │   ├── llm.py
│   │   │   ├── memory.py
│   │   │   ├── prompts.py
│   │   │   ├── splitter.py
│   │   │   └── vectorstore.py
│   │   │
│   │   ├── routes/
│   │   │   ├── chat.py
│   │   │   ├── documents.py
│   │   │   └── health.py
│   │   │
│   │   ├── schemas/
│   │   │   ├── chat.py
│   │   │   └── document.py
│   │   │
│   │   ├── services/
│   │   │   └── document_loader.py
│   │   │
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── app/
│   │   ├── chat/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   └── globals.css
│   │
│   ├── components/
│   │   └── chat-workspace.tsx
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── package.json
│
└── README.md
```

> The exact repository structure may evolve as later versions are
> developed.

------------------------------------------------------------------------

## Backend API

### Health Check

``` http
GET /api/health
```

Response:

``` json
{
  "status": "healthy"
}
```

### Document Upload

``` http
POST /api/documents/upload
```

Multipart form fields:

``` text
session_id
huggingface_api_key
file
```

Supported files:

``` text
.pdf
.docx
```

### Chat

``` http
POST /api/chat
```

Example request:

``` json
{
  "session_id": "your-session-id",
  "question": "What are the main points in this document?",
  "huggingface_api_key": "your-hugging-face-key",
  "mistral_api_key": "your-mistral-key"
}
```

------------------------------------------------------------------------

## Environment Variables

Create a `.env` file inside the backend directory.

Example:

``` env
MONGODB_URI=your_mongodb_connection_string

QDRANT_URL=your_qdrant_url
QDRANT_API_KEY=your_qdrant_api_key

HUGGINGFACE_API_KEY=optional_default_huggingface_key
HUGGINGFACE_EMBEDDING_MODEL=your_embedding_model

MISTRAL_API_KEY=optional_default_mistral_key
MISTRAL_MODEL=your_mistral_model
```

Do not commit `.env` files or API keys to GitHub.

The application supports user-provided API keys for the V1.0 BYOK
workflow.

------------------------------------------------------------------------

## Local Backend Setup

Clone the repository:

``` bash
git clone https://github.com/SoloWing01/LangChain-RAG-Application-Document-Embedding-Qdrant-Vector-Store.git
cd LangChain-RAG-Application-Document-Embedding-Qdrant-Vector-Store
```

Move into the backend:

``` bash
cd backend
```

Create a virtual environment:

``` bash
python -m venv venv
```

Activate it on Linux/macOS:

``` bash
source venv/bin/activate
```

On Windows:

``` bash
venv\Scripts\activate
```

Install dependencies:

``` bash
pip install -r requirements.txt
```

Start FastAPI:

``` bash
uvicorn app.main:app --reload
```

The backend will normally be available at:

``` text
http://localhost:8000
```

Swagger documentation:

``` text
http://localhost:8000/docs
```

------------------------------------------------------------------------

## Local Frontend Setup

Open another terminal:

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Start the development server:

``` bash
npm run dev
```

The frontend will normally be available at:

``` text
http://localhost:3000
```

If required, configure the backend URL using:

``` env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, the frontend uses the deployed Render backend URL.

------------------------------------------------------------------------

## Deployment

V1.0 is deployed using separate frontend and backend services.

### Frontend

The Next.js frontend is deployed on Vercel.

``` text
https://lang-chain-rag-application-document.vercel.app/
```

### Backend

The FastAPI backend is deployed on Render.

``` text
https://langchain-rag-application-document.onrender.com/
```

The backend exposes:

``` text
/
 /docs
 /api/health
 /api/documents/upload
 /api/chat
```

### CORS

The backend explicitly allows the production Vercel frontend origin:

``` text
https://lang-chain-rag-application-document.vercel.app
```

This is required because the frontend and backend are deployed on
different domains.

------------------------------------------------------------------------

## RAG Workflow

### 1. Upload

The user selects a PDF or DOCX document.

### 2. Document Loading

The backend extracts readable text from the uploaded document.

### 3. Chunking

The extracted content is split into smaller chunks.

``` text
Document
   ↓
1000-character chunks
   ↓
100-character overlap
```

### 4. Embedding

Each chunk is converted into a numerical vector using the configured
Hugging Face embedding model.

### 5. Vector Storage

The vectors and metadata are stored in Qdrant.

### 6. Retrieval

When the user asks a question, the application retrieves relevant
document chunks from Qdrant.

### 7. Generation

The retrieved context is passed to the Mistral model together with the
user's question.

### 8. Response

The application returns:

-   Generated answer
-   Retrieved sources

------------------------------------------------------------------------

## Session Isolation

V1.0 uses a generated session ID in the frontend.

Example:

``` text
session_id = UUID
```

The session ID is attached to uploaded document metadata and chat
memory.

This provides the foundation for separating documents and conversations
between sessions.

Persistent user accounts and stronger user-level isolation are planned
for later versions.

------------------------------------------------------------------------

## V1.0 Architecture

``` text
                    ┌──────────────────────┐
                    │       Next.js        │
                    │       Vercel         │
                    └──────────┬───────────┘
                               │
                               │ HTTPS
                               ▼
                    ┌──────────────────────┐
                    │       FastAPI        │
                    │        Render        │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐     ┌────────────┐   ┌──────────┐
        │ MongoDB  │     │ Hugging    │   │ Qdrant   │
        │  Atlas   │     │ Face       │   │          │
        │          │     │ Embeddings │   │ Vectors  │
        └──────────┘     └────────────┘   └────┬─────┘
                                                │
                                                ▼
                                         ┌────────────┐
                                         │  Mistral   │
                                         │    LLM     │
                                         └────────────┘
```

------------------------------------------------------------------------

## Security Considerations

V1.0 is designed as a learning and development project and is not intended
to be treated as a production-grade enterprise security implementation.

Important considerations:

-   API keys should never be committed to GitHub.
-   `.env` files should remain private.
-   User-provided API keys are sent over HTTPS to the backend.
-   Authentication is not implemented in V1.0.
-   Persistent user accounts are not implemented in V1.0.
-   Production-grade secret management and stronger access controls are
    planned for future versions.

------------------------------------------------------------------------

## Current Limitations

V1.0 intentionally keeps the application simple.

-   No user authentication
-   No persistent user accounts
-   No persistent chat sidebar
-   No document management dashboard
-   No document deletion UI
-   Session-based document association
-   Short-term chat memory
-   BYOK is required for model operations
-   Advanced RAG evaluation is not yet implemented
-   Advanced document processing for images/tables is not yet
    implemented

These limitations provide the foundation for future versions.

------------------------------------------------------------------------

## Version Roadmap

### V1.0 --- Core RAG

**Status: Completed and Live**

Implemented:

-   Document upload
-   PDF/DOCX processing
-   Text chunking
-   Embeddings
-   Qdrant vector storage
-   RAG retrieval
-   Mistral generation
-   MongoDB memory
-   Source display
-   BYOK
-   FastAPI backend
-   Next.js frontend
-   Vercel deployment
-   Render deployment

### V2 --- Persistent Workspace

Planned features:

-   User authentication
-   User profiles
-   Persistent conversations
-   Chat history
-   Persistent document records
-   Document management
-   Document deletion
-   User-specific vector filtering
-   Improved workspace UI

### Future Versions

Potential future improvements:

-   Advanced retrieval strategies
-   Hybrid search
-   Reranking
-   Better document parsing
-   Table and image understanding
-   RAG evaluation
-   Streaming responses
-   Improved observability
-   More granular access control

------------------------------------------------------------------------

## Why I Built This Project

The goal of this project was not just to build a chatbot.

The main objective was to understand how the components of a modern RAG
application work together:

``` text
Documents
    ↓
Chunking
    ↓
Embeddings
    ↓
Vector Database
    ↓
Retrieval
    ↓
LLM
    ↓
Grounded Response
```

Building V1.0 also provided practical experience with:

-   LangChain
-   FastAPI
-   Next.js
-   Qdrant
-   MongoDB
-   Hugging Face
-   Mistral
-   REST APIs
-   CORS
-   Environment variables
-   Cloud deployment
-   Debugging production issues

V1.0 establishes the foundation for continuing the project through
multiple versions.

------------------------------------------------------------------------

## Author

**Vishal Shekhar**

GitHub:\
https://github.com/SoloWing01

------------------------------------------------------------------------

## License

This project is intended for educational and portfolio purposes.