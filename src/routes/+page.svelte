<script lang="ts">
  import { player, loading, error, loadPlayer, loadClub, loaded, club, playerBattlelog } from "../lib/stores/player";
  import type { Brawler } from "../lib/types";
  import { updateIconsCapacitor } from "../lib/icon-updater";
  import { getProfileIconSrc } from "$lib/profile-icon";
  import {  getDeviceInfo } from "$lib/device-info";
  import { onMount } from "svelte";
  import { invoke } from "@tauri-apps/api/core";
  import { readFile } from "@tauri-apps/plugin-fs";

  //////////// EFFETTI PER I PUNTINI DI CARICAMENTO ////////////
  let loadingMessage = "Stiamo accendendo il server";
  let dots = "";
  let showServerMessage = true;
  let intervalId: any;
  let timeoutId: any;

  $: if ($loading) {
    // Avvia animazione solo se loading è true
    if (showServerMessage) {
      let dotCount = 1;
      dots = ".";
      loadingMessage = "Stiamo accendendo il server";
      clearInterval(intervalId);
      clearTimeout(timeoutId);

      intervalId = setInterval(() => {
        dotCount = dotCount < 3 ? dotCount + 1 : 1;
        dots = ".".repeat(dotCount);
      }, 1000);

      timeoutId = setTimeout(() => {
        showServerMessage = false;
        clearInterval(intervalId);
        dots = "";
        loadingMessage = "Caricamento profilo…";
      }, 10000);
    }
  } else {
    // Reset quando loading diventa false
    showServerMessage = true;
    dots = "";
    loadingMessage = "Stiamo accendendo il server";
    clearInterval(intervalId);
    clearTimeout(timeoutId);
  }

  ///////////////////////////////////////////////////////////////


  let playerTag = "";
  let clubTag = "";
  let iconSrc: string | null = null; // data uri o url pubblico

  const deviceInfo: 'Android' | 'iOS' | 'macOS' | 'Windows' | 'Linux' | 'Unknown' = getDeviceInfo();

  function set_loaded(to: string){
    loaded.set(to);
  }

  // utilità per ordinare i brawler per trofei
  $: topBrawlers = $player
    ? [...$player.brawlers].sort((a: Brawler, b: Brawler) => b.trophies - a.trophies).slice(0, 5)
    : [];
  $: playerClubTag = $player?.club?.tag || "";
  //$: clubMembersTags = $club?.members.map(m => m.tag) || [];
  function uint8ToBase64(bytes: Uint8Array): string {
    // trasformazione robusta evitando apply con array grandi
    let binary = "";
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
      binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return btoa(binary);
  }

  async function getProfileIconsFolderTauri(): Promise<string | null> {
    if (typeof window === "undefined" || !(window as any).__TAURI_IPC__) return null;
    try {
      const path: string = await invoke("get_profileicons_path");
      return path;
    } catch (e) {
      console.warn("getProfileIconsFolderTauri:", e);
      return null;
    }
  }

  async function getIconBase64TauriByPath(fullPath: string): Promise<string | null> {
  if (typeof window === "undefined" || !(window as any).__TAURI_IPC__) return null;
  try {
    const bytes: Uint8Array = await readFile(fullPath);
    const b64 = uint8ToBase64(bytes);
    return `data:image/png;base64,${b64}`;
  } catch (e) {
    console.warn("getIconBase64TauriByPath error:", e);
    return null;
  }
}

  // ---- Risolutore unico per la src dell'icona (Tauri / Capacitor / Web) ----
  async function resolveIconSrc(iconId: number, fallbackUrl: string | null | undefined = undefined) {
    iconSrc = null;

    if (deviceInfo === 'Android' || deviceInfo === 'iOS') {
      try {
        iconSrc = await getProfileIconSrc(iconId, fallbackUrl ?? undefined);
        return;
      } catch (e) {
        console.warn("Capacitor getProfileIconSrc failed:", e);
      }
    }

    if (deviceInfo === 'macOS' || deviceInfo === 'Windows' || deviceInfo === 'Linux') {
      try {
        const folder = await getProfileIconsFolderTauri();
        if (folder) {
          const normalizedFolder = folder.replace(/[\\/]+$/, "");
          const fullPath = `${normalizedFolder}/${iconId}.png`;
          const base64 = await getIconBase64TauriByPath(fullPath);
          iconSrc = base64;
          return;
        }
      } catch (e) {
        console.warn("Errore risolvendo icona Tauri:", e);
      }
    }

    // fallback Web/CDN
    iconSrc = fallbackUrl ?? `https://cdn.brawlify.com/profile-icons/regular/${iconId}.png`;
  }

  $: if ($player?.icon?.id) {
    resolveIconSrc($player.icon.id, $player.iconUrl).catch(e => console.error(e));
  }

  onMount(async () => {
    if (deviceInfo === 'Android' || deviceInfo === 'iOS') {
      // Mobile
      await updateIconsCapacitor();
      console.log("✔️ Icone aggiornate su Capacitor");
    } else {
      // PC
      console.log("🏁 Avvio su PC");
    }
  });
</script>

<div class="text-purple-300 text-shadow-white overflow-hidden">
  <header class="h-[7vh] justify-between flex bg-gray-900">
    <img src="/logo.png" alt="logo" class="h-full object-contain" />
    <img src="/brawl-tracker.png" alt="Brawl Tracker" class="h-full object-contain max-w-[60vw]" />
    <button class="h-full min-w-[3rem] shrink-0 flex items-center justify-center">
      <img src="/settings.png" alt="settings" class="h-full object-contain" />
    </button>
  </header>
  <div class="overflow-y-auto overflow-x-hidden h-[86vh] bg-gradient-to-b from-gray-700 to-gray-800">
    {#if !$loading}
      {#if deviceInfo === 'Windows' || deviceInfo === 'macOS' || deviceInfo === 'Linux'}
        <div class="flex justify-around">
          <p>Inserisci il tag del giocatore</p>
          <p>Inserisci il tag del club</p>
        </div>
        <div class="flex justify-around">
          <form on:submit|preventDefault={() => { loadPlayer(playerTag); set_loaded('player'); }}>
            <input placeholder="#TAG" bind:value={playerTag} aria-label="Inserisci tag" />
            <button disabled={$loading}>Cerca</button>
          </form>
          <form on:submit|preventDefault={() => { loadClub(clubTag); set_loaded('club'); }}>
            <input placeholder="#TAG" bind:value={clubTag} aria-label="Inserisci tag" />
            <button disabled={$loading}>Cerca</button>
          </form>
        </div>
      {:else}
        <div class="flex flex-col justify-around items-center">
          <p>Inserisci il tag del giocatore</p>
          <form on:submit|preventDefault={() => { loadPlayer(playerTag); set_loaded('player'); }}>
            <input  placeholder="#TAG" bind:value={playerTag} aria-label="Inserisci tag" />
            <button disabled={$loading}>Cerca</button>
          </form>
          <p>Inserisci il tag del club</p>
          <form on:submit|preventDefault={() => { loadClub(clubTag); set_loaded('club'); }}>
            <input placeholder="#TAG" bind:value={clubTag} aria-label="Inserisci tag" />
            <button disabled={$loading}>Cerca</button>
          </form>
        </div>
      {/if}
    {/if}

    {#if $loading}
      <div class="bg-gray-950/95 h-full w-full flex flex-col items-center justify-center">
        <img src="/loading.gif" alt="caricamento" class="h-[25%]"/>
        <p>{loadingMessage}{dots}</p>
      </div>
    {/if}

    {#if $error === "Errore 404: Errore Brawl Stars: 404 Not Found"}
      <div class="items-center justify-center flex flex-col">
        <img src="/loading-failure.gif" alt="loading failure">
        <p>CICCIO NON SAI SCRIVERE TORNA A SCUOLA 😉<small>(tag sbagliato)</small></p>
      </div>
    {/if}
    {#if $error && $error !== "Errore 404: Errore Brawl Stars: 404 Not Found"}
      <p style="color:red">{$error}</p>
    {/if}

    {#if $player && $playerBattlelog && $loaded == 'player'}
      <div class="max-h-[86vh] border border-gray-300 rounded-xl p-4">
        {#if iconSrc}
          <img src={iconSrc} alt="Icona di {$player.name}" class="w-16 h-16 rounded-full" />
        {/if}
        <h2>Nome: { $player.name }</h2>
        <p>Tag: { $player.tag }</p>
        <p><strong>Trofei:</strong> { $player.trophies } (max { $player.highestTrophies })</p>
        {#if $player.club}
          <p>
            <strong>Club:</strong> { $player.club.name } 
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <small on:click={() => { loadClub(playerClubTag); set_loaded('club'); }}>({ $player.club.tag })</small>
          </p>
        {/if}
        <p><strong>Livello:</strong> { $player.expLevel } — <strong>XP:</strong> { $player.expPoints }</p>

        {#if $player["3vs3Victories"] !== undefined}
          <p><strong>3v3 vittorie:</strong> { $player["3vs3Victories"] }</p>
        {/if}
        <p><strong>Solo vittorie:</strong> { $player.soloVictories ?? 0 } — <strong>Duo vittorie:</strong> { $player.duoVictories ?? 0 }</p>

        <h3>Top 5 Brawler per trofei</h3>
        <ul>
          {#each topBrawlers as b}
            <li>
              <strong>{b.name}</strong> — Trofei: {b.trophies} (max {b.highestTrophies}) — Power: {b.power} — Rank: {b.rank}
              {#if b.gears?.length}
                <div>Gears: {b.gears.map(g => `${g.name} ${g.level}`).join(", ")}</div>
              {/if}
              {#if b.starPowers?.length}
                <div>Star Powers: {b.starPowers.map(s => s.name).join(", ")}</div>
              {/if}
              {#if b.gadgets?.length}
                <div>Gadgets: {b.gadgets.map(g => g.name).join(", ")}</div>
              {/if}
            </li>
          {/each}
        </ul>
      </div>
    {/if}
    {#if $club && $loaded == 'club'}
      <div class="max-h-[86vh] border border-gray-300 rounded-xl p-4">
        <p>{ $club.name } <small> ({ $club.tag })</small></p>
        <p>descrizione: { $club.description }</p>
        <p>trofei richiesti: { $club.requiredTrophies }</p>
        <p>trofei totali: { $club.trophies }</p>
        <p>tipo: { $club.type }</p>
        <div>
          {#each $club.members as m}
            <p>nome: { m.name }</p>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <pre>    tag: <span style="cursor:pointer; color:#8b5cf6;" on:click={() => { loadPlayer(m.tag); set_loaded('player'); }}>{ m.tag }</span></pre>
            <pre>    ruolo: { m.role }</pre>
            <pre>    trofei: { m.trophies }</pre>
          {/each}
        </div>
      </div>
    {/if}
  </div>
  <footer class="bg-gray-900 h-[7vh] text-center flex items-center justify-center">
    <p>Created by Zanga Alessandro</p>
  </footer>
</div>

<style>
  form { display: flex; gap: .5rem;}
  input { flex: 1; padding: .5rem .75rem; }
  button { padding: .5rem .75rem; }
  ul { padding-left: 1.25rem; }
</style>
