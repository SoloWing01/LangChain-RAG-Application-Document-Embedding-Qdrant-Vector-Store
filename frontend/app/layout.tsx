import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "RAG Atelier", description: "A private workspace for talking to your documents." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
