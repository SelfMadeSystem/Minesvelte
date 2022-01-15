<script lang="ts">
  import Game from "./lib/components/Game.svelte";
  import MainMenu from "./lib/components/menus/MainMenu.svelte";
  import NewGame from "./lib/components/menus/NewGame.svelte";
  import Options from "./lib/components/menus/Options.svelte";
  import type { MainMenuNewGameOptions } from "./lib/utils/Events";

  let menu: string = "main";
  let options: MainMenuNewGameOptions;

  function onMenu(e: CustomEvent<any>) {
    menu = e.detail.menu;
    if (menu === "game") {
      options = e.detail;
    }
  }
</script>

<svelte:window on:contextmenu={(e) => e.preventDefault()} />

{#if menu === "main"}
  <MainMenu on:menu={onMenu} />
{:else if menu === "options"}
  <Options on:menu={onMenu} />
{:else if menu === "new-game"}
  <NewGame on:menu={onMenu} />
{:else if menu === "game"}
  <Game on:menu={onMenu} {options} />
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
