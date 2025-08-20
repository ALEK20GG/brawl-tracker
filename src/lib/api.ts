// src/lib/api.ts
import type {
  Player,
  BattleLogEntry,
  ClubFull,
  BrawlerInfo,
  EventSlot,
  PlayerRanking,
  ClubRanking,
} from "./types";
// src/lib/api.ts
import type { AssetEntry } from "./types";
import type { FankitAsset } from "./types";


const ASSET_MANIFEST_URL = "/assetManifest.json"; // path nella cartella `static` o `public`
const API_BASE = import.meta.env.VITE_API_BASE ?? "https://brawl-tracker-proxy.onrender.com";

export async function fetchAssetManifest(): Promise<AssetEntry[]> {
  const res = await fetch(ASSET_MANIFEST_URL);
  if (!res.ok) {
    throw new Error(`Impossibile caricare il manifest: ${res.status}`);
  }
  const manifest: AssetEntry[] = await res.json();
  return manifest;
}

// Helper per rimuovere il # dal tag
function cleanTag(tag: string): string {
  return tag.replace("#", "");
}

export async function fetchPlayer(rawTag: string): Promise<Player> {
  const tag = cleanTag(rawTag);
  const res = await fetch(`${API_BASE}/player/${tag}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<Player>;
}

export async function fetchBattlelog(rawTag: string): Promise<BattleLogEntry[]> {
  const tag = cleanTag(rawTag);
  const res = await fetch(`${API_BASE}/player/${tag}/battlelog`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<BattleLogEntry[]>;
}

export async function fetchClub(rawTag: string): Promise<ClubFull> {
  const tag = cleanTag(rawTag);
  const res = await fetch(`${API_BASE}/clubs/${tag}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<ClubFull>;
}

export async function fetchBrawlers(): Promise<BrawlerInfo[]> {
  const res = await fetch(`${API_BASE}/brawlers`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<BrawlerInfo[]>;
}

export async function fetchBrawlerById(id: number): Promise<BrawlerInfo> {
  const res = await fetch(`${API_BASE}/brawlers/${id}`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<BrawlerInfo>;
}

export async function fetchEvents(): Promise<EventSlot[]> {
  const res = await fetch(`${API_BASE}/events`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<EventSlot[]>;
}

export async function fetchPlayerRankings(countryCode: string): Promise<PlayerRanking[]> {
  const code = countryCode.toLowerCase();
  const res = await fetch(`${API_BASE}/rankings/${code}/players`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<PlayerRanking[]>;
}

export async function fetchClubRankings(countryCode: string): Promise<ClubRanking[]> {
  const code = countryCode.toLowerCase();
  const res = await fetch(`${API_BASE}/rankings/${code}/clubs`);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Errore ${res.status}: ${text || res.statusText}`);
  }
  return res.json() as Promise<ClubRanking[]>;
}

export async function fetchProfileIcons(): Promise<FankitAsset[]> {
  const res = await fetch("https://fankit.supercell.com/api/assets?game=Brawl%20Stars&assetType=Profile%20Pictures");
  if (!res.ok) {
    throw new Error(`Errore durante il caricamento delle icone profilo: ${res.status}`);
  }
  const data = await res.json();
  return data.assets as FankitAsset[];
}
