<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Toggle from "../form/Toggle.svelte";

    const dispatch = createEventDispatcher();

    let neverShowAgain =
        localStorage.getItem("neverShowTutorialAgain") === "true";

    function close() {
        localStorage.setItem(
            "neverShowTutorialAgain",
            neverShowAgain.toString()
        );

        dispatch("close");
    }
</script>

<div class="h-screen mx-12 overflow-auto p-8">
    <h1>Welcome to Minesvelte!</h1>

    <p>This is a clone of the classic game Minesweeper, written in Svelte.</p>

    <p>
        If you don't already know how to play Minesweeper, you should absolutely
        play that game first. You can find it on Windows, or you can play it
        online.
    </p>

    <p>
        The goal of the game is to uncover all the tiles that don't have mines
        underneath them. If you uncover a tile with a mine, you lose. If you
        uncover all the tiles without mines, you win.
    </p>

    <p>
        You can uncover a tile by left-clicking on it. If you uncover a tile
        with a number, that number tells you how many mines are adjacent to that
        tile. If you uncover a tile with no mines adjacent to it, all the
        adjacent tiles will be uncovered as well.
    </p>

    <p>
        You can mark a tile as having a mine underneath it by right-clicking on
        it. This will put a flag on the tile. You can remove the flag by
        right-clicking on the tile again.
    </p>

    <p>
        You can zoom in and out by scrolling with your mouse. You can also move
        around the grid by clicking and dragging with your mouse.
    </p>

    <p>
        Note: touch screens are not supported yet. I plan to add support for
        them in the future.
    </p>

    <p>
        You can undo by pressing "u" on your keyboard. You can redo by pressing
        "r" on your keyboard.
    </p>

    <p>
        You can hold down the control key to highlight the tiles considered to
        be adjacent to the tile the mouse is hovering over. This can be useful
        as it is not always obvious which tiles are considered adjacent,
        especially with more complex patterns.
    </p>

    <p>
        When making a new game, the patterns marked with a star are the ones
        that are considered to be "interesting". These are the patterns that I
        have found to be the most interesting to play. The other patterns are
        included for completeness.
    </p>

    <p>
        You can also enable/disable "corners" and "connected" in the "Mines"
        section of the settings. The "corners" option means that the numbers
        inside the shapes will be the number of mines both orthogonally and
        diagonally adjacent to the tile. The "connected" option means that the
        numbers will be either of type <code>~3~</code> or <code>{"{3}"}</code>.
        The <code>~3~</code> type means that not <em>all</em> of the mines are
        orthogonally adjacent to each other. The <code>{"{3}"}</code> type means
        that <em>all</em> of the mines are orthogonally adjacent to each other.
    </p>

    <p>
        That's all for now! If you have any questions, comments, or suggestions,
        please feel free to open an issue on the <a
            href="https://github.com/SelfMadeSystem/Minesvelte/issues"
            target="_blank"
            rel="noreferrer">GitHub repository</a
        >.
    </p>

    <div class="text-white flex flex-row justify-evenly w-full">
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label>
            Never show this tutorial again
            <Toggle
                name="Never show this tutorial again"
                bind:state={neverShowAgain}
                _class="ml-4"
            />
        </label>

        <button on:click={close}>Close</button>
    </div>
</div>

<style lang="scss">
    * {
        pointer-events: all;
    }

    h1 {
        @apply text-2xl my-3.5 text-white;
    }

    p {
        @apply text-lg my-3.5 text-white;
    }

    button {
        @apply bg-gray-800 text-white text-lg rounded-lg p-2 my-3.5;
    }

    button:hover {
        @apply bg-gray-700 text-white text-lg rounded-lg;
    }
</style>
