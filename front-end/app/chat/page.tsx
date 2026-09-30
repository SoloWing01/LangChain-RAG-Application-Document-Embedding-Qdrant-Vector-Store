"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  text: string;
};

type SourceItem = {
  source?: string;
  page?: number;
  document_id?: string;
  content?: string;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://langchain-rag-application-document.onrender.com";

export default function ChatPage() {
  const [sessionId] = useState(() => crypto.randomUUID());
  const [huggingFaceKey, setHuggingFaceKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      text: "Add your keys, upload a PDF or DOCX, and then ask a question about the document.",
    },
  ]);
  const [status, setStatus] = useState<{ type: "info" | "success" | "error"; text: string }>({
    type: "info",
    text: "No document uploaded yet.",
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [sourceItems, setSourceItems] = useState<SourceItem[]>([]);

  const sessionLabel = useMemo(() => sessionId.slice(0, 8), [sessionId]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus({ type: "error", text: "Please choose a PDF or DOCX file first." });
      return;
    }

    if (!huggingFaceKey.trim()) {
      setStatus({ type: "error", text: "Hugging Face API key is required to upload and index the document." });
      return;
    }

    const formData = new FormData();
    formData.append("session_id", sessionId);
    formData.append("huggingface_api_key", huggingFaceKey.trim());
    formData.append("file", selectedFile);

    try {
      setIsUploading(true);
      setStatus({ type: "info", text: "Uploading and indexing your document..." });

      const response = await fetch(`${API_BASE_URL}/api/documents/upload`, {
        method: "POST",
        body: formData,
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.detail || "Document upload failed.");
      }

      setUploadedFileName(selectedFile.name);
      setStatus({
        type: "success",
        text: `Document uploaded successfully: ${selectedFile.name}`,
      });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleAsk = async (event: FormEvent) => {
    event.preventDefault();

    if (!question.trim()) {
      setStatus({ type: "error", text: "Please enter a question before asking the assistant." });
      return;
    }

    if (!huggingFaceKey.trim() || !mistralKey.trim()) {
      setStatus({ type: "error", text: "Both Hugging Face and Mistral API keys are required for chat." });
      return;
    }

    const userQuestion = question.trim();
    const nextMessage: Message = { id: crypto.randomUUID(), role: "user", text: userQuestion };
    setMessages((previous) => [...previous, nextMessage]);
    setQuestion("");
    setStatus({ type: "info", text: "Generating answer from your indexed document..." });
    setIsAsking(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          session_id: sessionId,
          question: userQuestion,
          huggingface_api_key: huggingFaceKey.trim(),
          mistral_api_key: mistralKey.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.detail || "The assistant could not answer the question.");
      }

      const answer = payload?.answer || "No answer returned.";
      const sources = Array.isArray(payload?.sources) ? payload.sources : [];

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: answer,
        },
      ]);
      setSourceItems(sources);
      setStatus({ type: "success", text: "Answer generated successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        text: error instanceof Error ? error.message : "Chat request failed.",
      });
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <main className="chat-shell">
      <div className="chat-layout">
        <div className="chat-topbar">
          <h2>RAG Chat Workspace</h2>
          <Link href="/" className="back-link">
            ← Back to home
          </Link>
        </div>

        <div className="chat-content">
          <aside className="sidebar">
            <div className="panel-title">Session</div>
            <div className="form-grid">
              <div className="input-group">
                <label htmlFor="session-id">Session ID</label>
                <input id="session-id" value={sessionId} readOnly />
              </div>

              <div className="input-group">
                <label htmlFor="hf-key">Hugging Face API key</label>
                <input
                  id="hf-key"
                  type="password"
                  placeholder="hf_..."
                  value={huggingFaceKey}
                  onChange={(event) => setHuggingFaceKey(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="mistral-key">Mistral API key</label>
                <input
                  id="mistral-key"
                  type="password"
                  placeholder="Your Mistral key"
                  value={mistralKey}
                  onChange={(event) => setMistralKey(event.target.value)}
                />
              </div>

              <div className="input-group">
                <label htmlFor="file-upload">Document upload</label>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
                />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="action-button secondary"
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload document"}
                </button>
              </div>
            </div>

            <div className={`status-box ${status.type}`}>
              {status.text}
            </div>

            {uploadedFileName ? (
              <div className="status-box success" style={{ marginTop: 18 }}>
                Uploaded file: {uploadedFileName}
              </div>
            ) : null}
          </aside>

          <section className="main-panel">
            <div className="chat-window">
              {messages.map((message) => (
                <div key={message.id}>
                  <div className="message meta">
                    {message.role === "user" ? `You • ${sessionLabel}` : "Assistant"}
                  </div>
                  <div className={`message ${message.role}`}>{message.text}</div>
                </div>
              ))}

              {sourceItems.length > 0 && (
                <div className="sources">
                  {sourceItems.map((source, index) => (
                    <div key={`${source.document_id ?? index}-${index}`} className="source-card">
                      <strong>Source {index + 1}</strong>
                      <div>File: {source.source || "Document"}</div>
                      <div>Page: {source.page ?? "N/A"}</div>
                      <div>{source.content ? `${source.content.slice(0, 200)}...` : "No preview available"}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="prompt-box">
              <form className="prompt-form" onSubmit={handleAsk}>
                <textarea
                  aria-label="Ask a question"
                  placeholder="Ask something about the uploaded document..."
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                />
                <button type="submit" className="action-button" disabled={isAsking}>
                  {isAsking ? "Thinking..." : "Ask"}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
