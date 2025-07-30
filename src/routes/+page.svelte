<script lang="ts">
  import { player, loading, error, loadPlayer } from "../lib/stores/player";
  import type { Brawler } from "../lib/types";

  let inputTag = "#2G22CL280"; // valore iniziale per test

  // utilità per ordinare i brawler per trofei
  $: topBrawlers = $player
    ? [...$player.brawlers].sort((a: Brawler, b: Brawler) => b.trophies - a.trophies).slice(0, 5)
    : [];
</script>

<section>
  <h1>Brawl Tracker</h1>

  <form on:submit|preventDefault={() => loadPlayer(inputTag)}>
    <input
      placeholder="#TAG"
      bind:value={inputTag}
      aria-label="Inserisci tag"
    />
    <button disabled={$loading}>Cerca</button>
  </form>

  {#if $loading}
    <p>Caricamento…</p>
  {/if}

  {#if $error}
    <p style="color:red">{$error}</p>
  {/if}

  {#if $player}
    <div class="card">
      <h2>{ $player.name } <small>({ $player.tag })</small></h2>
      <p><strong>Trofei:</strong> { $player.trophies } (max { $player.highestTrophies })</p>
      {#if $player.club}
        <p><strong>Club:</strong> { $player.club.name } ({ $player.club.tag })</p>
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
</section>

<style>
  section { max-width: 900px; margin: 0 auto; padding: 1rem; }
  form { display: flex; gap: .5rem; margin-bottom: 1rem; }
  input { flex: 1; padding: .5rem .75rem; }
  button { padding: .5rem .75rem; }
  .card { border: 1px solid #e5e5e5; border-radius: 12px; padding: 1rem; }
  ul { padding-left: 1.25rem; }
</style>
