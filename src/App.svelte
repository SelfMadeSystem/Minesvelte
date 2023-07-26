<script lang="ts">
  import Game from "./lib/components/Game.svelte";
  import MainMenu from "./lib/components/menus/MainMenu.svelte";
  import NewGame from "./lib/components/menus/NewGame.svelte";
  import Options from "./lib/components/menus/Options.svelte";
  import { HexGrid, SquareGrid } from "./lib/game/grid";
  import { square, hex, triangle } from "./lib/patterns/hexPatterns";
  import type { MainMenuNewGameOptions } from "./lib/utils/Events";

  let menu: string = "main";
  let unique: {} = {};
  let options: MainMenuNewGameOptions = {
      // grid: new SquareGrid(),
      grid: new HexGrid(),
      mineCount: 20,
      minePercent: true,
      pattern: triangle,
      patternSize: {
          Symmetric: true,
          Width: 0,
          BottomHeight: 10,
          TopHeight: 6,
      },
      type: "main-menu-new-game",
      connectedNumber: false
  };

  function onMenu(e: CustomEvent<any>) {
    menu = e.detail.menu;
    if (menu === "game") {
      options = e.detail;
      newGame();
    }
  }

  function newGame() {
    unique = {};
    options.grid = options.pattern.newGrid();
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
  {#key unique}
    <Game on:menu={onMenu} {options} on:game-new-game={newGame} />
  {/key}
{/if}

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }
</style>
