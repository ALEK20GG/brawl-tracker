<script lang="ts">
  import Button from '$lib/Button.svelte';
  import { onMount } from 'svelte';
  import { goto } from "$app/navigation";
  import Tubo from '$lib/Tubo.svelte';
  import { cubicOut } from 'svelte/easing';
  import { fly } from 'svelte/transition';
  import Settings from '$lib/Settings.svelte';
  import { coins, max_score, skin_in_use, background_in_use, settings } from '../../stores/localstorage';

  let gameStarted = false;
  let gameOver = false;
  let birdY = 50; // centro verticale
  let birdVelocity = 0;
  let hitbox_shown = false;
  let show_settings = false;
  let bg_counter = 0;
  const birdX = 20; // percentuale orizzontale dove si trova l'uccello
  const birdHeight = 8; // larghezza stimata dell’uccello in percentuale

  //suoni
  let coin_volume = 0.1;
  let jump_volume = 0.1;
  let death_volume = 0.1;

  let container:HTMLButtonElement
  let bird:HTMLDivElement

  const gravity = 0.60;
  const jumpForce = -4;
  let score = 0;

  // Ogni tubo avrà: x (posizione), top e bottom (altezza %)
  type Pipe = { x: number; top: number; bottom: number; hasCoin: boolean, coin_collected: boolean };
  let pipes: Pipe[] = [];
  let interval: any;

  let loaded = false;
  let transitioning = false;

  function goToMenu() {
    transitioning = true;
    setTimeout(() => {
      goto('/');
    }, 500);
  }

  function handleGoToMenu(event: MouseEvent) {
    event.stopPropagation();
    goToMenu();
  }

  function startGame() {
    birdY = 50;
    birdVelocity = 0;
    score = 0;
    gameOver = false;
    gameStarted = true;

    // genera 3 tubi distanziati
    pipes = [];
    for (let i = 0; i < 3; i++) {
      const top = Math.floor(Math.random() * 40) + 10;
      const bottom = 100 - top - 40; // gap 20%
      const hasCoin = Math.random() < 1 / 3; // 33.3%

      pipes.push({ x: 100 + i * 41, top, bottom, hasCoin, coin_collected: false });
    }

    interval = setInterval(() => {
      birdVelocity += gravity;
      birdY += birdVelocity;

      // muovi e ricicla i tubi
      pipes = pipes.map((pipe, index) => {
        let newX = pipe.x - 1;
        if (newX < -10) {
          const lastPipeX = Math.max(...pipes.map(p => p.x));
          const spacing = 50; // distanza orizzontale tra i tubi in percentuale
          const top = Math.floor(Math.random() * 40) + 10;
          const bottom = 100 - top - 40;
          const hasCoin = Math.random() < 1 / 3; // 33.3%
          score++;
          if(score%15==0)
          {
            bg_counter++;
          }
          if(bg_counter >= $background_in_use.length)
          {
            bg_counter=0;
          }
          
          return { x: lastPipeX + spacing, top, bottom, hasCoin, coin_collected: false };
        }
        return { ...pipe, x: newX };
      });


      // collisione con tubi
    for (const pipe of pipes) {
      let container_width = container.getBoundingClientRect().width;
      let width = bird.getBoundingClientRect().width
      let width_percentage = (width * 100)/container_width;
      const pipeWidth = 10; // anche i tubi sono larghi 10%
      const birdLeft = birdX;
      const birdRight = birdX + width_percentage;

      const pipeLeft = pipe.x;
      const pipeRight = pipe.x + pipeWidth;

      const overlapsHorizontally = birdRight >= pipeLeft && birdLeft <= pipeRight;

      if (overlapsHorizontally) {
        if (birdY <= pipe.top || birdY + birdHeight >= pipe.top + 40) {
          endGame();
        }
      }
      // controllo raccolta moneta
      if (
        pipe.hasCoin &&
        !pipe.coin_collected &&
        overlapsHorizontally &&
        birdY + birdHeight >= pipe.top + 15 &&
        birdY <= pipe.top + 25 // range verticale del centro del gap
      ) {
        pipe.coin_collected = true;
        coins.update(n => n +1);
        playEffect('coin');
      }

    }


      // fuori schermo
      if (birdY > 100 || birdY < 0) {
        endGame();
      }
    }, 30);
  }

  function playEffect(type: 'jump' | 'coin' | 'death') {
    let src = '';
    let volume = 0.3;

    if (type === 'jump') {
      src = '/audio/jump.wav';
      volume = jump_volume;
    } else if (type === 'coin') {
      src = '/audio/coin.wav';
      volume = coin_volume;
    } else if (type === 'death') {
      src = '/audio/death.wav';
      volume = death_volume;
    }

    const sound = new Audio(src);
    sound.volume = volume;
    sound.play();
  }


  function flap() {
    if (!gameStarted) {
      startGame();
    }
    if (!gameOver) {
      birdVelocity = jumpForce;
      playEffect('jump');
    }
  }

  function endGame() {
    bg_counter=0;
    if(score > $max_score)
    {
      max_score.set(score);
    }
    clearInterval(interval);
    gameOver = true;
    playEffect('death')
    gameStarted = false;
  }

    function go_to_settings() {
    show_settings = true;
  }

  onMount(() => {
  loaded = true;
  const handleKey = (e: KeyboardEvent) => {
    if (e.code === 'Space' && !show_settings) {
      flap();
    }
  };
  window.addEventListener('keydown', handleKey);
  return () => window.removeEventListener('keydown', handleKey);
});

</script>

<!--{#if loaded == true}-->
<button
  bind:this={container}
  class="w-full h-full relative hover:cursor-pointer overflow-hidden min-h-screen transition-transform duration-500 ease-in-out"
  on:click={() => {
    if (!show_settings) flap();
  }}
  transition:fly={{ y: 50, duration: 500, easing: cubicOut }}
  class:translate-y-full={transitioning}
>
  <div class="w-full h-full" style="background-image: url(/bg/{$background_in_use[bg_counter]}); background-size: cover; background-position: center; -webkit-transition: background-image 0.2s ease-in-out; transition: background-image 0.2s ease-in-out;">
    <!-- Uccello -->
    <div
      bind:this={bird}
      class="absolute transition-all duration-[30ms] w-fit {hitbox_shown ? 'bg-red-500' : ''}"
      style="top: {birdY}%; left: {birdX}%; height: {birdHeight}%"
    >
      <img
        alt="flappy bird"
        src="/birds/{$skin_in_use}"
        class="w-full h-full object-contain"
      />
    </div>

    <!-- Tubi -->
    {#each pipes as pipe (pipe.x)}
      <Tubo {pipe} hitboxShown={hitbox_shown} rnd={pipe.hasCoin} coin_collected={pipe.coin_collected}/>
    {/each}

    <!-- Punteggio -->
    <div class="absolute top-[1%] bottom-[5%] text-[100%] text-white text-shadow-lg/200 font-bold left-[49%]">
      Score: {score}
    </div>

    <!-- Game Over -->
    {#if gameOver}
      <div class="w-[70%] h-[30%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-8 text-center">
        <div class="2xl:text-6xl xl:text-5xl lg:text-4xl md:text-3xl sm:text-2xl text-red-500 font-bold font-pixelify text-shadow-lg/200">
          GAME OVER
        </div>
        <Button onclick={handleGoToMenu}>Return to menu</Button>
      </div>
    {/if}
    </div>
  </button>
  
  <!-- Monete -->
  <div class="fixed top-[2%] w-full h-[5%] flex items-center space-x-7 p-2 z-40">
    <h1 class="text-[clamp(1%,5vw,175%)] font-pixelify text-white text-border">COINS: {$coins}</h1>
    <img src="/coin.gif" alt="moneta" class="scale-[200%] h-full w-auto">
  </div>

  <!-- Bottone impostazioni con z-50 per renderlo cliccabile -->
  <div class="fixed top-[5%] right-[2%] flex items-center space-x-7 p-2 h-[5%] w-[5%] z-50">
    <button on:click={go_to_settings} class="bg-white rounded-full shadow-md p-1 hover:scale-105 transition">
      <img src="/img/impostazioni.png" alt="impostazioni" class="w-full h-full" />
    </button>
  </div>

  <!-- Menu impostazioni -->
  {#if show_settings}
    <Settings bind:coin_volume bind:jump_volume bind:death_volume bind:show_settings bind:hitbox_shown/>
  {/if}