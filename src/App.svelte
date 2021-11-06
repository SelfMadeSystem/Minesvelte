<script lang="ts">
  import Overlay from "./lib/Overlay.svelte";
  import Game from "./lib/Game.svelte";
</script>

<svelte:window
  on:contextmenu={e => e.preventDefault()}
/>

<Game />
<!-- This must render last -->
<Overlay />

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
