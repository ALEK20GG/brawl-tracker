<script lang="ts">
  import type { HTMLButtonAttributes } from "svelte/elements";

  let { className = "", ...others }: { className?: string } & HTMLButtonAttributes = $props();
</script>

<button
  {...others}
  class="{className} w-[30%] h-[30%] mb-5 bg-yellow-400 text-white text-border z-50 text-3xl font-semibold font-pixelify rounded-xl shadow-md border-4 border-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[120%] hover:bg-yellow-500 active:scale-95"
>
  <slot />
</button>
