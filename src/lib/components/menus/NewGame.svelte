<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type {
        MainMenuChangeOptions,
        MainMenuNewGameOptions,
    } from "../../utils/Events";
    import * as squarePatterns from "../../patterns/squarePatterns";
    import * as hexPatterns from "../../patterns/hexPatterns";
    import type { Pattern } from "src/lib/patterns/patterns";
    import Toggle, { State } from "../form/Toggle.svelte";
    import { HexGrid, SquareGrid } from "../../game/grid";

    let type: string = "square";
    let patterns: Map<string, Pattern> = new Map<string, Pattern>();
    let patternsArr: string[];

    $: if (type) {
        patterns.clear();
        switch (type) {
            default:
            case "square":
                for (const key in squarePatterns) {
                    if (
                        Object.prototype.hasOwnProperty.call(
                            squarePatterns,
                            key
                        )
                    ) {
                        const element = squarePatterns[key];
                        patterns.set(key, element);
                    }
                }
                break;
            case "hex":
                for (const key in hexPatterns) {
                    if (
                        Object.prototype.hasOwnProperty.call(hexPatterns, key)
                    ) {
                        const element = hexPatterns[key];
                        patterns.set(key, element);
                    }
                }
                break;
        }
        patternsArr = Array.from(patterns.keys());
    }
    let selected: string;
    let selectedPattern: Pattern;
    let parameters: string[];
    let selectedParameters: { [key: string]: number } = {};

    $: if (selected) {
        resetSelected();
    }

    function resetSelected() {
        selectedPattern = patterns.get(selected);
        parameters = selectedPattern.parameters;
        selectedParameters = {};
        for (const parameter of parameters) {
            selectedParameters[parameter] = 5;
        }
    }

    let mineCount: number = 35;
    let minePercent: State = "true";

    const dispatch = createEventDispatcher();

    function changeMenu(name: string) {
        dispatch("menu", {
            type: "main-menu-change",
            menu: name,
        } as MainMenuChangeOptions);
    }

    function newGame() {
        dispatch("menu", {
            type: "main-menu-new-game",
            menu: "game",
            grid: type == "square" ? new SquareGrid() : new HexGrid(),
            pattern: selectedPattern,
            patternSize: selectedParameters,
            mineCount: mineCount,
            minePercent: minePercent === "true",
        } as MainMenuNewGameOptions);
    }
</script>

<div>
    <select name="type" id="type" class="rounded-t-lg" bind:value={type}>
        <option value="square">Square Grid</option>
        <option value="hex">Hex Grid</option>
    </select>

    <select name="pattern" id="pattern" bind:value={selected}>
        {#each patternsArr as pattern}
            <option value={pattern}>{patterns.get(pattern).name}</option>
        {/each}
    </select>

    {#if parameters}
        {#each parameters as parameter}
            <label class="number-input"
                >{parameter}
                <input
                    type="number"
                    bind:value={selectedParameters[parameter]}
                    min="1"
                    max="50"
                    step="1"
                    name={parameter}
                />
            </label>
        {/each}
        <label class="number-input"
            >Mine Count
            <input
                type="number"
                bind:value={mineCount}
                min="1"
                step="1"
                name="mineCount"
            />
        </label>
        <!-- svelte-ignore a11y-label-has-associated-control -->
        <label class="boolean-input"
            >Mine Percent
            <Toggle name="minePercent" bind:state={minePercent} _class="ml-4" />
        </label>
    {/if}

    <button on:click={() => newGame()} class="new-game rounded-b-lg">
        New game
    </button>

    <button
        on:click={() => window.alert("This is dead button")}
        class="rounded"
    >
        Load game
    </button>

    <button on:click={() => changeMenu("main")} class="exit rounded">
        Back
    </button>
</div>

<style lang="scss">
    * {
        pointer-events: all;
    }

    div {
        @apply flex flex-col align-middle justify-center w-72 h-screen m-auto;
    }

    button {
        @apply bg-gray-800 text-white text-2xl p-2;

        &.rounded {
            @apply rounded-lg my-3.5;
        }
    }

    button:hover {
        @apply bg-gray-700;

        &.new-game {
            @apply bg-sky-800;
        }

        &.exit {
            @apply bg-red-800;
        }
    }

    select {
        @apply bg-gray-800 text-white text-2xl p-2 border-b-2 border-gray-900;
    }

    .number-input {
        @apply flex flex-col items-center justify-center w-72;
        @apply bg-gray-800 text-white text-2xl pt-2;

        input {
            @apply bg-gray-600 text-white text-2xl p-1 mt-2 w-72 cursor-text;
            appearance: textfield;
            &[type="number"]::-webkit-inner-spin-button,
            &[type="number"]::-webkit-outer-spin-button {
                -webkit-appearance: none;
            }
        }
    }

    .boolean-input {
        @apply flex flex-row items-center justify-center w-72;
        @apply bg-gray-800 text-white text-2xl pt-2;

        input {
            @apply bg-gray-600 text-2xl p-1 ml-2;
            appearance: checkbox;
        }
    }
</style>
