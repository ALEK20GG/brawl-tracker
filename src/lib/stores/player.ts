// src/lib/stores/player.ts
import { writable } from "svelte/store";
import type { Player } from "../types";
import { fetchPlayer } from "../api";

export const player = writable<Player | null>(null);
export const loading = writable(false);
export const error = writable<string | null>(null);

export async function loadPlayer(tag: string) {
  loading.set(true);
  error.set(null);
  try {
    const data = await fetchPlayer(tag);
    player.set(data);
  } catch (e) {
    error.set((e as Error).message);
    player.set(null);
  } finally {
    loading.set(false);
  }
}
