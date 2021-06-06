<script lang="ts">
  import { browser } from '$app/env';
  import Footer from '$lib/components/Footer.svelte';
  import Header from '$lib/components/Header.svelte';
  import { dark } from '$lib/stores';
  import { isDarkMode } from '$lib/util';
  import { onMount } from 'svelte';

  // Set theme
  if (browser) dark.update((_) => isDarkMode());

  onMount(() => {
    dark.subscribe((dark) => {
      if (dark) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    });
  });
</script>

<Header />
<slot />
<Footer />

<style global lang="postcss">
	@tailwind base;
	@tailwind components;
	@tailwind utilities;
</style>
