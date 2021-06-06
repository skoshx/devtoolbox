<script lang="ts">
  export let classes: string;
</script>

<section class={`rounded-3xl shadow-xl w-full overflow-hidden ${classes}`}>
  <slot />
</section>
