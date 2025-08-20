// src/lib/stores/player.ts
import { writable } from "svelte/store";
import type { Player, ClubFull, AssetEntry } from "../types";
import { fetchClub, fetchPlayer, fetchAssetManifest } from "../api";

const ASSET_BASE_URL = 'https://fankit.supercell.com/game-assets/';

export const player = writable<Player | null>(null);
export const club = writable<ClubFull | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);
export const loaded = writable<string | null>(null);
let assetManifest: AssetEntry[] = [];
fetchAssetManifest()
  .then(m => assetManifest = m)
  .catch(err => console.error("Errore caricamento manifest:", err));
function getProfileIconUrl(iconId: number): string | null {
  const entry = assetManifest.find(a => a.id === iconId && a.type === 'ProfileIcon');
  if (!entry) return null;
  return `${ASSET_BASE_URL}${entry.collection}/${entry.fileName}`;
}

export async function loadPlayer(tag: string) {
  loading.set(true);
  error.set(null);
  try {
    const data = await fetchPlayer(tag);
    player.set({...data, iconUrl: data?.icon?.id ? `https://cdn.brawlify.com/profile-icons/regular/${data.icon.id}.png` : null});
  } catch (e) {
    error.set((e as Error).message);
    player.set(null);
  } finally {
    loading.set(false);
  }
}
export async function loadClub(tag:string) {
  loading.set(true);
  error.set(null);
  try{
    const data = await fetchClub(tag);
    club.set(data);
  } catch (e) {
    error.set((e as Error).message);
    player.set(null);
  } finally {
    loading.set(false);
  }
  
}