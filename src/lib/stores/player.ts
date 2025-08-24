// src/lib/stores/player.ts
import { writable } from "svelte/store";
import type { Player, ClubFull, AssetEntry, BattleLogEntry } from "../types";
import { fetchClub, fetchPlayer, fetchAssetManifest, fetchBattlelog } from "../api";

const ASSET_BASE_URL = 'https://fankit.supercell.com/game-assets/';

export const player = writable<Player | null>(null);
export const playerBattlelog = writable<BattleLogEntry[] | null>(null);
export const club = writable<ClubFull | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);
export const loaded = writable<string | null>(null);

export async function loadPlayer(tag: string) {
  loading.set(true);
  error.set(null);
  try {
    const playerData = await fetchPlayer(tag);
    player.set({...playerData, iconUrl: playerData?.icon?.id ? `https://cdn.brawlify.com/profile-icons/regular/${playerData.icon.id}.png` : null});
    const battlelogData = await fetchBattlelog(tag);
    playerBattlelog.set(battlelogData);
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