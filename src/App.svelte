<script lang="ts">
  import Game from "./lib/components/Game.svelte";
  import MainMenu from "./lib/components/menus/MainMenu.svelte";
  import Options from "./lib/components/menus/Options.svelte";

  let menu: string = "main";

  function onMenu(e: CustomEvent<any>) {
    menu = e.detail.menu;
  }
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

{#if menu === "main"}
  <MainMenu on:menu={onMenu} />
{:else if menu === "options"}
  <Options on:menu={onMenu} />
{:else if menu === "game"}
  <Game />
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
