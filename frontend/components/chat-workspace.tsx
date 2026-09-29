"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, KeyboardEvent, useRef, useState } from "react";
import { apiRequest, ChatResult } from "../lib/api";

type Message = { id: string; role: "assistant" | "user"; text: string; sources?: ChatResult["sources"] };
type Notice = { tone: "error" | "success"; text: string };
const makeSession = () => typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `session-${Date.now()}`;

export function ChatWorkspace() {
  const [sessionId, setSessionId] = useState(makeSession);
  const [hfKey, setHfKey] = useState("");
  const [mistralKey, setMistralKey] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [documents, setDocuments] = useState<string[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const missingKeys = !hfKey.trim() || !mistralKey.trim();
  const showError = (text: string) => setNotice({ tone: "error", text });

  async function sendQuestion(event?: FormEvent) {
    event?.preventDefault();
    const text = question.trim();
    if (!text || isSending) return;
    if (missingKeys) { showError("Add both your Hugging Face and Mistral API keys before starting a conversation."); return; }
    setNotice(null); setQuestion("");
    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: "user", text }]); setIsSending(true);
    try {
      const result = await apiRequest<ChatResult>("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session_id: sessionId, question: text, huggingface_api_key: hfKey.trim(), mistral_api_key: mistralKey.trim() }),
      });
      setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: "assistant", text: result.answer, sources: result.sources }]);
    } catch (error) { showError(error instanceof Error ? error.message : "The request could not be completed."); }
    finally { setIsSending(false); }
  }

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]; event.target.value = "";
    if (!file) return;
    if (!hfKey.trim()) { showError("Add your Hugging Face API key before uploading a document."); return; }
    if (!/\.(pdf|docx)$/i.test(file.name)) { showError("Please choose a PDF or DOCX document."); return; }
    setNotice(null); setIsUploading(true);
    const form = new FormData(); form.append("session_id", sessionId); form.append("huggingface_api_key", hfKey.trim()); form.append("file", file);
    try {
      const result = await apiRequest<{ filename: string }>("/api/documents/upload", { method: "POST", body: form });
      setDocuments((current) => current.includes(result.filename) ? current : [...current, result.filename]);
      setNotice({ tone: "success", text: `${result.filename} is indexed and ready to use.` });
    } catch (error) { showError(error instanceof Error ? error.message : "The document could not be uploaded."); }
    finally { setIsUploading(false); }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); void sendQuestion(); } }
  function startNewChat() { setSessionId(makeSession()); setMessages([]); setDocuments([]); setQuestion(""); setNotice(null); }

  return <main className="workspace">
    <aside className="sidebar">
      <div className="sidebar-top"><Link className="brand" href="/">RAG<span>_</span>ATELIER</Link><button className="sidebar-new" onClick={startNewChat}>+ New chat</button></div>
      <details className="key-panel" open><summary><span className="status-dot" /> API CONNECTION <span className="summary-chevron">⌄</span></summary><div className="key-fields"><label>Hugging Face API key<input type="password" value={hfKey} onChange={(e) => setHfKey(e.target.value)} placeholder="hf_••••••••••••" autoComplete="off" /></label><label>Mistral API key<input type="password" value={mistralKey} onChange={(e) => setMistralKey(e.target.value)} placeholder="••••••••••••" autoComplete="off" /></label><p className="key-note">Kept in this tab only. Never saved in the browser.</p></div></details>
      <div className="sidebar-bottom"><Link href="/">← About RAG Atelier</Link></div>
    </aside>
    <section className="chat-area">
      <header className="chat-header"><div><p className="eyebrow">DOCUMENT WORKSPACE</p><h1>Ask your archive</h1></div><button className="new-chat-mobile" onClick={startNewChat}>+ New chat</button></header>
      {notice && <div className={`toast ${notice.tone}`} role="status"><span aria-hidden="true">{notice.tone === "success" ? "✓" : "!"}</span><p>{notice.text}</p><button aria-label="Dismiss notification" onClick={() => setNotice(null)}>×</button></div>}
      <div className={`conversation ${messages.length ? "has-messages" : ""}`}>
        {!messages.length && <div className="empty-state"><div className="orb" aria-hidden="true" /><p className="eyebrow">READY WHEN YOU ARE</p><h2>What do you want<br />to understand?</h2><p>Connect your keys, attach a document with the + button, then ask a question.</p><div className="prompt-list"><button onClick={() => setQuestion("Give me a concise summary of this document.")}>Summarise this document <span>↗</span></button><button onClick={() => setQuestion("What are the key decisions and next steps?")}>Find decisions & next steps <span>↗</span></button></div></div>}
        {messages.map((message) => <article className={`message ${message.role}`} key={message.id}><p className="message-label">{message.role === "user" ? "YOU" : "RAG ATELIER"}</p><div className="message-text">{message.text}</div>{message.sources && message.sources.length > 0 && <details className="sources"><summary>{message.sources.length} retrieved source{message.sources.length === 1 ? "" : "s"}</summary>{message.sources.map((source, index) => <p key={`${source.source}-${index}`}><strong>{source.source || "Document"}</strong>{source.page ? ` · Page ${source.page}` : ""}<span>{source.content}</span></p>)}</details>}</article>)}
        {isSending && <article className="message assistant loading"><p className="message-label">RAG ATELIER</p><div className="typing"><i /><i /><i /></div></article>}
      </div>
      <form className="composer" onSubmit={sendQuestion}>
        {documents.length > 0 && <div className="document-row">{documents.map((document) => <span className="document-chip" key={document}>⌁ {document}</span>)}</div>}
        <textarea value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={handleKeyDown} placeholder={missingKeys ? "Add your API keys to start…" : "Message RAG Atelier"} rows={1} disabled={isSending} />
        <div className="composer-footer"><button className="attach-button" type="button" onClick={() => fileInput.current?.click()} disabled={isUploading} aria-label="Attach a PDF or DOCX">{isUploading ? <span className="mini-loader" /> : "+"}</button><span className="composer-help">{isUploading ? "Indexing your document…" : "PDF or DOCX · Enter to send"}</span><button className="send-button" type="submit" disabled={!question.trim() || isSending} aria-label="Send message">↑</button></div>
        <input ref={fileInput} className="sr-only" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={uploadDocument} />
      </form>
    </section>
  </main>;
}
