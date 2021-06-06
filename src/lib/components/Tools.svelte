<script lang="ts">
  import { drag } from "$lib/motion";
  import Pomodoro from "./Pomodoro.svelte";
  import Todo from "./Todo.svelte";
  import Weather from "./Weather.svelte";
  
</script>

<div class="h-screen w-screen relative p-4 bg-pink-50 dark:bg-gray-900 z-0 pt-5 grid grid-cols-1 gap-4 lg:grid-cols-3">
  <div use:drag>
    <Pomodoro />
  </div>
  <div use:drag>
    <Todo />
  </div>
  <div use:drag>
    <Weather />
  </div>
</div>