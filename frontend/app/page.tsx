import Link from "next/link";
const Arrow = () => <span aria-hidden="true">↗</span>;
export default function Home() {
  return <main className="landing">
    <nav className="landing-nav"><Link className="brand" href="/">RAG<span>_</span>ATELIER</Link><Link className="nav-cta" href="/chat">Open workspace <Arrow /></Link></nav>
    <section className="hero"><p className="eyebrow">PRIVATE DOCUMENT INTELLIGENCE</p><h1>Put your knowledge<br /><em>in the conversation.</em></h1><p className="hero-copy">Upload your documents, bring your own model keys, and ask better questions. RAG Atelier retrieves the relevant context before it answers.</p><div className="hero-actions"><Link className="button button-primary" href="/chat">Start a conversation <Arrow /></Link><a className="button button-text" href="#how-it-works">How it works <span>↓</span></a></div></section>
    <section className="statement"><p>YOUR FILES, YOUR KEYS, YOUR CONTEXT.</p><div className="statement-mark" aria-hidden="true"><i /><i /><i /></div></section>
    <section className="how" id="how-it-works"><p className="eyebrow">HOW IT WORKS</p><div className="steps"><article><span>01</span><h2>Connect</h2><p>Add your Hugging Face and Mistral API keys in the workspace. They are used for the current session only.</p></article><article><span>02</span><h2>Ground</h2><p>Upload a PDF or DOCX. The application breaks it into searchable knowledge for your private session.</p></article><article><span>03</span><h2>Explore</h2><p>Ask naturally. Answers are grounded in retrieved passages and show the sources used.</p></article></div></section>
    <footer className="landing-footer"><span>RAG ATELIER / 2026</span><span>BUILT FOR THOUGHTFUL QUESTIONS</span></footer>
  </main>;
}
