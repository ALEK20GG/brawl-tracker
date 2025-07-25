<script>
    import { coins, max_score, skin_in_use, background_in_use, settings } from '../stores/localstorage';
    import { get } from 'svelte/store';
    export let jump_volume = 0.1;
    export let death_volume = 0.1;
    export let coin_volume = 0.1;
    export let show_settings = true;
    export let hitbox_shown = false;
    $: {
      const s = get(settings);
      jump_volume = s.jump_volume;
      death_volume = s.death_volume;
      coin_volume = s.coins_volume;
      hitbox_shown = s.hitboxshown;
    }
    function go_back(){
      show_settings = false;
    }
    function update_settings()
    {
      settings.set({
        jump_volume: jump_volume, 
        death_volume: death_volume, 
        coins_volume: coin_volume, 
        hitboxshown: hitbox_shown
      })
    }
</script>
<div class="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 z-50 w-[300px]">
  <h1 class="text-xl font-bold text-center mb-4">Settings</h1>
  <!-- BOTTONE DI USCITA -->
  <div class="absolute top-2 right-2">
    <button onclick={go_back} class="bg-white rounded-full shadow-md p-1 hover:scale-105 transition">
      <img src="/img/exit.png" alt="exit" class="w-6 h-6" />
    </button>
  </div>
  <!-- Sezione checkbox hitbox -->
  <div class="mb-3 flex items-center space-x-2">
    <input 
      type="checkbox" 
      bind:checked={hitbox_shown}
      id="hitboxToggle"
      onchange={update_settings}
      class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
    />
    <label for="hitboxToggle" class="text-sm font-semibold text-black">{hitbox_shown ? "🟩 Hitbox visible": "🟥 Hitbox hidden"}</label>
  </div>

  <div class="mb-3">
    <label class="text-sm font-semibold text-black" for="jump volume">🎧 Jump Volume:</label>
    <input
      id="jump volume"
      oninput={update_settings}
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={jump_volume}
      class="w-full accent-green-600"
    />
    <span class="text-sm text-black">{Math.round(jump_volume * 100)}%</span>
  </div>

  <div class="mb-3">
    <label class="text-sm font-semibold text-black" for="death volume">🎧 Death Volume:</label>
    <input
      id="death volume"
      oninput={update_settings}
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={death_volume}
      class="w-full accent-green-600"
    />
    <span class="text-sm text-black">{Math.round(death_volume * 100)}%</span>
  </div>

  <div class="mb-3">
    <label class="text-sm font-semibold text-black" for="coin volume">🎧 Coin Volume:</label>
    <input
      id="coin volume"
      oninput={update_settings}
      type="range"
      min="0"
      max="1"
      step="0.01"
      bind:value={coin_volume}
      class="w-full accent-green-600"
    />
    <span class="text-sm text-black">{Math.round(coin_volume * 100)}%</span>
  </div>
</div>
