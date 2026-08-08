// Talks to the local Express backend in /server (see README).
// In dev, Vite proxies /api/* to it; in a static build, set VITE_API_URL
// to wherever you're running the backend.
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // no JSON body
  }

  if (!res.ok) {
    throw new Error(data?.error ?? `Request failed (${res.status})`);
  }
  if (data?.error) {
    throw new Error(data.error);
  }
  return data as T;
}
