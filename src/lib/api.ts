// src/lib/api.ts
import type { Player } from "./types";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://brawl-tracker-proxy.onrender.com";

export async function fetchPlayer(rawTag: string): Promise<Player> {
  // Rimuovo il #, perché in URL diventerebbe un frammento
  const cleanTag = rawTag.replace("#", "");
  const res = await fetch(`${API_BASE}/player/${cleanTag}`, {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    // Provo a estrarre un testo utile per il debug
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<Player>;
}
