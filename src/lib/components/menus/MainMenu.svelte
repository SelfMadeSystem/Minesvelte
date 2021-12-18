<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type { MainMenuChangeOptions } from "../../utils/Events";

    const dispatch = createEventDispatcher();

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

<div>
    <button on:click={() => changeMenu("game")} class="new-game">
        New game
    </button>

    <button on:click={() => changeMenu("load-game")}> Load game </button>

    <button on:click={() => changeMenu("options")}> Options </button>

    <button on:click={exit} class="exit"> Exit </button>
</div>

<style lang="scss">
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
