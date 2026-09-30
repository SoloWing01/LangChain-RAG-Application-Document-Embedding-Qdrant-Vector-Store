import Link from "next/link";

export default function Home() {
  return (
    <main className="landing-shell">
      <section className="hero-card">
        <div className="eyebrow">RAG Workspace</div>
        <h1>Upload documents and chat with your own AI keys.</h1>
        <p>
          Connect your Hugging Face and Mistral keys, upload PDF or DOCX files,
          and ask grounded questions from your own indexed knowledge base.
        </p>

        <div className="feature-list">
          <div>• Securely use your own API keys</div>
          <div>• PDF and DOCX document upload</div>
          <div>• Retrieval-augmented chat experience</div>
        </div>

        <div className="hero-actions">
          <Link href="/chat" className="primary-button">
            Open chat
          </Link>
          <a
            href="https://langchain-rag-application-document.onrender.com/docs"
            target="_blank"
            rel="noreferrer"
            className="secondary-button"
          >
            View API docs
          </a>
        </div>
      </section>
    </main>
  );
}
