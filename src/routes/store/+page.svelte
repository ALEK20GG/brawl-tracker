<script lang="ts">
  import { get } from "svelte/store"
  import { onMount } from 'svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import { Splide, SplideSlide } from '@splidejs/svelte-splide';
  import '@splidejs/splide/css';
  import Button from '$lib/Button.svelte';
  import { coins, owned_skins, owned_backgrounds } from '../../stores/localstorage';
  import type{ Backgrounds } from "../../stores/localstorage";
  let loaded = false;

  const splideOptions = {
    type: 'loop',
    perPage: 3,
    autoplay: true,
    gap: '7%',
    pagination: false,
    arrows: true,
    interval: 3000,
    pauseOnHover: true,
  };

  const birds = [
    { skin: "/birds/bird_batman.png", price: 200 },
    { skin: "/birds/bird_vampire.png", price: 150 },
    { skin: "/birds/bird_cyber.png", price: 300 },
    { skin: "/birds/bird_mummia.png", price: 100 },
    { skin: "/birds/bird_pepe.png", price: 150 },
    { skin: "/birds/bird_cavaliere.png", price: 50 },
    { skin: "/birds/bird_dino.png", price: 25 },
    { skin: "/birds/bird_mage.png", price: 70 },
    { skin: "/birds/bird_goku.png", price: 200 },
    { skin: "/birds/bird_pirate.png", price: 40 },
    { skin: "/birds/bird_superman.png", price: 80 },
    { skin: "/birds/bird_unicorn.png", price: 150 },
    { skin: "/birds/bird_zombie.png", price: 20 }
  ];

  const bgs = [
    { packPath: "/bg/pack_city/", category: "city", img: ["/bg/pack_city/10.png","/bg/pack_city/7.png","/bg/pack_city/8.png","/bg/pack_city/9.png","/bg/pack_city/erw.png","/bg/pack_city/s46yrdcù.png","/bg/pack_city/sfnghgj.png","/bg/pack_city/sxgh.png"], price: 60 },
    { packPath: "/bg/pack_clouds/", category: "clouds", img: ["/bg/pack_clouds/dfsvc.png","/bg/pack_clouds/dfg.png","/bg/pack_clouds/dsfgh.png","/bg/pack_clouds/fgedbf.png","/bg/pack_clouds/sfrt.png","/bg/pack_clouds/svexd.png","/bg/pack_clouds/wtefs.png"], price: 40 },
    { packPath: "/bg/pack_nature/", category: "nature", img: ["/bg/pack_nature/ersv.png","/bg/pack_nature/dhybj.png","/bg/pack_nature/drvh.png","/bg/pack_nature/sbhg.png"], price: 15 },
    { packPath: "/bg/pack_night/", category: "night", img: ["/bg/pack_night/adesr.png","/bg/pack_night/5.png","/bg/pack_night/dastryu.png","/bg/pack_night/fdf.png","/bg/pack_night/vtrdh.png"], price: 25 }
  ]

  onMount(() => {
    loaded = true;
    console.log($owned_backgrounds.city[0])
    console.log(bgs[0].img[0])
  });

  function buyBird(boughtSkin: string, skinPrice: number) {
    if ($coins < skinPrice) {
      alert("Not enough coins to buy this skin!");
    }
    else if (!get(owned_skins).includes(boughtSkin.replace("/birds/", "")))
    {
      owned_skins.update(skin => [...skin, boughtSkin.replace("/birds/", "")])
      coins.update(coin => coin-skinPrice)
    }
  }

  async function buyBackground(boughtBg: string, bgPrice: number, bgPaths: Array<string>, cat: string) {
    const category = cat as keyof Backgrounds;
    if ($coins < bgPrice) {
      alert("Not enough coins to buy this skin!");
    }
    else
    {
      owned_backgrounds.update(bg => { 
        const merged = [...bg[category], ...bgPaths];
        // Rimuovi duplicati (opzionale ma consigliato)
        const unique = Array.from(new Set(merged));
        return {
          ...bg,
          [category]: unique
        };
      });
      coins.update(coin => coin - bgPrice)
    }
  }



</script>

{#if loaded}
  <div transition:fly={{ y: 50, duration: 500, easing: cubicOut }}>
    <div class="fixed top-[3%] left-[1%] flex flex-row items-center space-x-7 p-2">
      <div class="font-pixelify text-white text-3xl text-border">COINS: { $coins }</div>
      <img src="/coin.gif" alt="moneta" class="  scale-[200%]">
    </div>
    <div class="w-full h-full flex flex-col items-center justify-center">
      <h1 class="mt-[2%] mb-[2%] h-fit text-8xl font-bold font-pixelify text-yellow-300 text-shadow-lg/200 hover:scale-[120%] transition-transform duration-300 ease-in-out">
        Store
      </h1>
      <h2 class="h-fit mb-[0%] text-5xl font-bold font-pixelify text-yellow-300 text-shadow-lg/200">
        Skins
      </h2>
      <Splide aria-label="Skins" class="w-[40%] h-[40%]" options={splideOptions}>
        {#each birds as bird}
          <SplideSlide>
            <div class="relative group w-full h-full">
              <img class="group-hover:scale-[120%] transition-transform duration-300 ease-in-out" src={bird.skin} alt=""/>
              <div class="absolute inset-0 bg-black/50 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <div role="group" class="flex flex-row items-center space-x-5">
                  <div class="text-white text-2xl font-extralight font-pixelify">{bird.price}</div>
                  <div class="coin-animation scale-[2]"></div>
                </div>
                {#if !$owned_skins.includes(bird.skin.replace("/birds/", ""))}
                  <button onclick={() => buyBird(bird.skin, bird.price)} aria-label="Buy button" class ="w-[50%] h-[20%] mt-[4%] bg-yellow-400 text-white text-border z-50 text-xl font-semibold font-pixelify rounded-lg shadow-md border-4 border-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[120%] hover:bg-yellow-500 active:scale-95">Buy</button>
                  {:else}
                  <button aria-label="Owned button" class ="w-[50%] h-[20%] mt-[4%] bg-yellow-400 text-white text-border z-50 text-xl font-semibold font-pixelify rounded-lg shadow-md border-4 border-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[120%] hover:bg-yellow-500 active:scale-95">Owned</button>
                {/if}
              </div>
            </div>
          </SplideSlide>
        {/each}
      </Splide>
      <h2 class="h-fit mb-[2%] text-5xl font-bold font-pixelify text-yellow-300 text-shadow-lg/200">
        Backgrounds
      </h2>
      <Splide aria-label="Backgrounds" class="w-[40%] h-[40%]" options={splideOptions}>
        {#each bgs as bg}
          <SplideSlide>
            <div class="relative group w-full h-full">
              <img class="group-hover:scale-[120%] transition-transform duration-300 ease-in-out" src={bg.img[0]} alt=""/>
              <div class="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl">
                <div class="flex flex-row items-center space-x-5">
                  <div class="text-white text-2xl font-bold font-pixelify">{bg.price}</div>
                  <div class="coin-animation scale-[2]"></div>
                </div>
                  {#if !$owned_backgrounds[bg.category as keyof Backgrounds].includes(bg.img[0])}
                    <button onclick={() => buyBackground(bg.packPath, bg.price, bg.img, bg.category)} class="w-[50%] h-[35%] mt-[4%] bg-yellow-400 text-white text-border z-50 text-xl font-semibold font-pixelify rounded-lg shadow-md border-4 border-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[120%] hover:bg-yellow-500 active:scale-95">Buy</button>
                    {:else}
                      <button aria-label="Owned button" class ="w-[50%] h-[35%] mt-[4%] bg-yellow-400 text-white text-border z-50 text-xl font-semibold font-pixelify rounded-lg shadow-md border-4 border-white transition-all duration-300 ease-in-out hover:shadow-2xl hover:scale-[120%] hover:bg-yellow-500 active:scale-95">Owned</button>
                  {/if}
                </div>
              </div>
          </SplideSlide>
        {/each}
      </Splide>
      <div class="flex w-[50%] h-[50%] mt-[2%] justify-center items-center">
        <Button><a href="/">Go back</a></Button>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(.splide__arrow) {
    background-color: #ffe600;
    border: 2px solid black;
    border-radius: 9999px;
    width: 4rem;
    height: 4rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 90% 90%;
    transition: background-color 0.2s, filter 0.2s;
  }

  :global(.splide__arrow--prev) {
    left: -4.5rem;
    background-image: url('arrow_left.png');
  }

  :global(.splide__arrow--next) {
    right: -4.5rem;
    background-image: url('/arrow_right.png');
  }

  :global(.splide__arrow svg) {
    display: none;
  }

  :global(.splide__arrow:hover) {
    background-color: #eab308;
    filter: brightness(0.9);
    cursor: pointer;
  }
</style>