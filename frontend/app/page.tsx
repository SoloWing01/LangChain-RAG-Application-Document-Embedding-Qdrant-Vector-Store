import Link from "next/link";
const Arrow = () => <span aria-hidden="true">↗</span>;
export default function Home() {
  return <main className="landing">
    <nav className="landing-nav"><Link className="brand" href="/">RAG<span>_</span>ATELIER</Link><Link className="nav-cta" href="/chat">Open workspace <Arrow /></Link></nav>
    <section className="hero"><p className="eyebrow">PRIVATE DOCUMENT INTELLIGENCE</p><h1>Put your knowledge<br /><em>in the conversation.</em></h1><p className="hero-copy">Upload your documents, bring your own model keys, and ask better questions. RAG Atelier retrieves the relevant context before it answers.</p><div className="hero-actions"><Link className="button button-primary" href="/chat">Start a conversation <Arrow /></Link><a className="button button-text" href="#how-it-works">How it works <span>↓</span></a></div></section>
    <section className="rag-explainer" aria-labelledby="rag-title">
      <div className="rag-explainer-intro"><p className="eyebrow">WHAT IS RAG?</p><h2 id="rag-title">Answers that start with <em>your</em> documents.</h2><p>RAG means Retrieval-Augmented Generation. Before the AI answers, RAG Atelier finds the most relevant passages in the documents you upload and gives that context to the model. This helps keep responses useful, traceable, and grounded in your material.</p></div>
      <div className="rag-flow" aria-label="RAG workflow"><article><span>01</span><strong>Your PDF or DOCX</strong><p>Upload the knowledge you want to explore.</p></article><b aria-hidden="true">→</b><article><span>02</span><strong>Relevant context</strong><p>RAG finds passages related to your question.</p></article><b aria-hidden="true">→</b><article><span>03</span><strong>Grounded answer</strong><p>The model replies using those passages and shows its sources.</p></article></div>
    </section>
    <section className="byok"><div><p className="eyebrow">BYOK · BRING YOUR OWN KEY</p><h2>You stay in control of model access.</h2></div><p>Enter your own Hugging Face and Mistral API keys when you open the workspace. They are held only for the current browser session and are used to process your requests—they are not saved by this frontend.</p></section>
    <section className="statement"><p>YOUR FILES, YOUR KEYS, YOUR CONTEXT.</p><div className="statement-mark" aria-hidden="true"><i /><i /><i /></div></section>
    <section className="how" id="how-it-works"><p className="eyebrow">HOW IT WORKS</p><div className="steps"><article><span>01</span><h2>Connect</h2><p>Add your Hugging Face and Mistral API keys in the workspace. They are used for the current session only.</p></article><article><span>02</span><h2>Ground</h2><p>Upload a PDF or DOCX. The application breaks it into searchable knowledge for your private session.</p></article><article><span>03</span><h2>Explore</h2><p>Ask naturally. Answers are grounded in retrieved passages and show the sources used.</p></article></div></section>
    <footer className="landing-footer"><span>RAG ATELIER / 2026</span><span>BUILT FOR THOUGHTFUL QUESTIONS</span></footer>
  </main>;
}
