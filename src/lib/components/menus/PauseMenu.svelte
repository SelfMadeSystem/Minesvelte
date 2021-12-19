<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { GameResumeOptions, MainMenuChangeOptions } from "../../utils/Events";

    const dispatch = createEventDispatcher();

    function changeMenu(name: string) {
        dispatch("menu", {
            type: "main-menu-change",
            menu: name,
        } as MainMenuChangeOptions);
    }

    function resume() {
        dispatch("game-resume", {});
    }

    function options() {
    }
</script>

<div>
    <button on:click={resume} class="resume">
        Resume
    </button>

    <button on:click={options}>
        Options
    </button>

    <button on:click={() => window.alert("Bruh u think I implemented shit yet?")}>
        Save game
    </button>

    <button on:click={() => changeMenu("main")} class="exit"> Exit </button>
</div>

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

        &.resume {
            @apply bg-green-800;
        }

        &.exit {
            @apply bg-red-800;
        }
    }
</style>
