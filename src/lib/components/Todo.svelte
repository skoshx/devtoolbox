<script lang="ts">
  import Tool from "./Tool.svelte";

  interface Todo {
    id: number;
    task: string;
    completed: boolean;
  }

  // A simple todo list
  let todos: Todo[] = [
    {
      id: 0,
      task: "Work on the opensource project you have been meaning to work on.",
      completed: false
    },
    {
      id: 1,
      task: "Clean room",
      completed: false
    }
  ];

  let current: string = "";
</script>

<Tool classes="bg-gradient-to-r from-gray-400 to-gray-600 text-white select-none">
  <h1 class="text-xl flex items-center font-medium p-4">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
    </svg>
    Todo
  </h1>
  <div class="w-full bg-gray-50 text-gray-900 p-4 space-y-3">
    <input type="text" placeholder="What needs to be done?" bind:value={current} class="bg-transparent text-2xl w-full font-thin focus:outline-none pb-4" />
    <!-- Display todos -->
    {#each todos as todo (todo.id)}
    <div class="flex items-center justify-center rounded-3xl p-6 shadow-xl-center bg-white">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="min-width: 1.5rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
      </svg>
      <p class="text-lg text-gray-500 font-semibold tracking-wide leading-tight flex-grow mr-2">{todo.task}</p>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" style="min-width: 1.5rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    </div>
    {/each}
  </div>
</Tool>