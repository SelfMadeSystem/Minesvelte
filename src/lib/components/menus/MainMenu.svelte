<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { MainMenuChangeOptions } from "../../utils/Events";
    import Tutorial from "./Tutorial.svelte";

    const dispatch = createEventDispatcher();

    let showTutorial =
        localStorage.getItem("neverShowTutorialAgain") !== "true";

    function changeMenu(name: string) {
        dispatch("menu", {
            type: "main-menu-change",
            menu: name,
        } as MainMenuChangeOptions);
    }

    function exit() {
        window.close();
    }
</script>

{#if showTutorial}
    <Tutorial on:close={() => (showTutorial = false)} />
{:else}
    <div>
        <button on:click={() => changeMenu("new-game")} class="new-game">
            New game
        </button>

        <button on:click={() => window.alert("This is dead button")}>
            Load game
        </button>

        <button on:click={() => changeMenu("options")}> Options </button>

        <button on:click={() => (showTutorial = true)}>
            Tutorial
        </button>

        <button on:click={exit} class="exit"> Exit </button>
    </div>
{/if}

<style lang="scss">
    * {
        pointer-events: all;
    }

    div {
        @apply flex flex-col align-middle justify-center w-72 h-screen m-auto;
    }

    button {
        @apply bg-gray-800 text-white text-5xl rounded-lg p-2 my-3.5;
    }

    button:hover {
        @apply bg-gray-700 text-white text-5xl rounded-lg;

        &.new-game {
            @apply bg-sky-800;
        }

        &.exit {
            @apply bg-red-800;
        }
    }
</style>
