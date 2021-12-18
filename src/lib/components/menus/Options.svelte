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

    function apply() {
        window.alert("Congratulations! You have successfully applied nothing!");
    }
</script>

<div>
    <button on:click={() => window.alert("Pretend this is a page title.")}>
        Options
    </button>

    <button on:click={apply} class="apply"> Apply </button>

    <button on:click={() => changeMenu("main")} class="exit"> Exit </button>
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

        &.apply {
            @apply bg-green-800;
        }

        &.exit {
            @apply bg-red-800;
        }
    }
</style>
