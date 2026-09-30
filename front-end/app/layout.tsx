import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RAG Application",
  description: "Document-based question and answer workspace with user-provided APIs.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
