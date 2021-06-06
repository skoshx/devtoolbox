<script lang="ts">
import { writable } from "svelte/store";

  // Pomodoro timer, the BEST thing for productivity.
  import Tool from "./Tool.svelte";

  let isBreak = false;
  let pomodoro: string = '50';
  let short: string = '10';
  let long: string = '15';
  let finished: number = 0;
  let running: boolean = false;
  let interval: number = null;

  const pomodoroStore = writable(parseInt(pomodoro) * 60);

  $: {
    const x = { pomodoro, short, long };
    reset();
  }

  pomodoroStore.subscribe((left: number) => {
    if (left <= 0 && !isBreak) {
      // Pause
      stop();

      finished = finished + 1; // Yey, break!
      isBreak = true;

      const i = finished % 4;
      if (i === 0) pomodoroStore.set(parseInt(long) * 60); // Long break, yey!
      else pomodoroStore.set(parseInt(short) * 60); // Normal break
    } else if (left <= 0 && isBreak) {
      isBreak = false;
      pomodoroStore.set(parseInt(pomodoro) * 60);
    }
  });

  function reset() {
    stop();
    if (isBreak) {
      const i = finished % 4;
      if (i === 0) pomodoroStore.set(parseInt(long) * 60); // Long break, yey!
      else pomodoroStore.set(parseInt(short) * 60); // Normal break
    } else {
      pomodoroStore.set(parseInt(pomodoro) * 60);
    }
  }

  function handleClick() {
    if (running) stop();
    else start();
  }

  function start() {
    if (running) return;
    interval = window.setInterval(() => {
      pomodoroStore.update((value) => value - 1);
    }, 1000);
    running = true;
  }

  function stop() {
    clearInterval(interval);
    running = false;
  }

  function clock(s: number) {
    const minutes = ~~(s % 3600 / 60);
    const seconds = ~~(s % 3600 % 60);
    return `${minutes}:${seconds}${seconds == 0 ? '0' : ''}`;
  }
</script>

<Tool classes="bg-gradient-to-r from-red-600 to-red-400 text-white select-none">
  <h1 class="text-xl flex items-center font-medium p-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    Pomodoro
  </h1>
  <div class="flex justify-center items-center px-4">
    <input type="text" bind:value={pomodoro} class="bg-transparent text-7xl w-24 font-thin focus:outline-none text-center" />
    <h1 class="text-7xl text-gray-300 font-thin">/</h1>
    <input type="text" bind:value={short} class="bg-transparent text-7xl w-24 font-thin focus:outline-none text-center" />
    <h1 class="text-7xl text-gray-300 font-thin">/</h1>
    <input type="text" bind:value={long} class="bg-transparent text-7xl w-24 font-thin focus:outline-none text-center" />
  </div>
  <!--<div class="flex items-center justify-center">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <h1>
      {new Date(Date.now() + $pomodoroStore * 1000).toISOString()}
    </h1>
  </div>-->
  <h1 class="text-7xl font-thin flex justify-center items-center relative py-6 px-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mr-2 absolute left-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <!-- The Clock -->
    {clock($pomodoroStore)}
  </h1>
  <div class="flex">
    <div class="w-full focus:outline-none hover:bg-gray-200 transition bg-red-50 px-4 py-2 shadow-xl text-gray-900 font-semibold flex justify-center items-center tracking-normal cursor-pointer" on:click={handleClick}>
      {#if running}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Stop
      {:else}
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      Start {isBreak ? 'break' : 'working'}
      {/if}
    </div>
    <div class="w-full focus:outline-none hover:bg-gray-200 transition bg-red-50 px-4 py-2 shadow-xl text-gray-900 font-semibold flex justify-center items-center tracking-normal cursor-pointer" on:click={reset}>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
      Reset
    </div>
  </div>
</Tool>
