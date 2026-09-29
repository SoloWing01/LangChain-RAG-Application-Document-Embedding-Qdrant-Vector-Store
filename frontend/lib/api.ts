const DEFAULT_BACKEND_URL = "https://langchain-rag-application-document.onrender.com";
const LOCAL_BACKEND_URL = "http://localhost:8000";

export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_BACKEND_URL || LOCAL_BACKEND_URL
).replace(/\/$/, "");

export type ChatResult = { answer: string; sources: Array<{ source?: string; content?: string; page?: number }> };
type ApiError = Error & { status?: number };
export async function apiRequest<T>(path: string, init: RequestInit): Promise<T> {
  let response: Response;
  try { response = await fetch(`${API_URL}${path}`, init); }
  catch { const error = new Error("We couldn’t reach the RAG server. Check that the backend is running.") as ApiError; error.status = 0; throw error; }
  if (!response.ok) {
    let detail = "Something went wrong while processing your request.";
    try { const body = await response.json(); detail = typeof body.detail === "string" ? body.detail : detail; } catch { /* retain safe fallback */ }
    const error = new Error(providerMessage(response.status, detail)) as ApiError; error.status = response.status; throw error;
  }
  return response.json() as Promise<T>;
}
function providerMessage(status: number, detail: string) {
  const clue = detail.toLowerCase();
  if (status === 401 || status === 403 || /invalid|unauthori[sz]ed|authentication|api.?key/.test(clue)) return "One of your API keys is invalid or does not have the required access. Check both keys and try again.";
  if (status === 429 || /rate.?limit|quota|exhaust|too many/.test(clue)) return "Your provider quota or rate limit has been reached. Wait a moment, or check your Hugging Face and Mistral account limits.";
  if (status >= 500 && /mistral|hugging.?face|provider/.test(clue)) return "A model provider could not complete this request. Please verify your keys and provider quota, then try again.";
  return detail;
}
