<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import type {
        MainMenuChangeOptions,
        MainMenuNewGameOptions,
    } from "../../utils/Events";
    import * as squarePatterns from "../../patterns/squarePatterns";
    import * as hexPatterns from "../../patterns/hexPatterns";
    import * as fractalPatterns from "../../patterns/fractalPatterns";
    import type { Pattern, PatternParam } from "src/lib/patterns/patterns";
    import Toggle, { type State } from "../form/Toggle.svelte";

    let type: string = "square";
    let patterns: Map<string, Pattern<any>> = new Map<string, Pattern<any>>();
    let patternsArr: string[];

    $: if (type) {
        patterns.clear();
        let ppp: any;
        switch (type) {
            default:
            case "square":
                ppp = squarePatterns;
                break;
            case "hex":
                ppp = hexPatterns;
                break;
            case "fractal":
                ppp = fractalPatterns;
                break;
        }

        for (const key in ppp) {
            if (Object.prototype.hasOwnProperty.call(ppp, key)) {
                const element = ppp[key];
                patterns.set(key, element);
            }
        }
        patternsArr = Array.from(patterns.keys());
    }
    let selected: string = "basic";
    let selectedPattern: Pattern<any>;
    let parameters: PatternParam[];
    let selectedParameters: { [key: string]: any } = {};

    $: if (selected) {
        resetSelected();
    }

    function resetSelected() {
        selectedPattern = patterns.get(selected);
        parameters = selectedPattern.parameters;
        selectedParameters = {};
        for (const parameter of parameters) {
            selectedParameters[parameter.name.replaceAll(" ", "")] =
                parameter.default;
        }
    }

    let mineCount: number = 20;
    let minePercent: State = "true";
    let connectedNumber: State = "true"; // I like this so I'm making it default
    let includeCorners: State = "true";
    let colors: number = 1;

    let autoGenerate: State = "true";

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
            grid: selectedPattern.newGrid(),
            pattern: selectedPattern,
            patternSize: selectedParameters,
            mineCount: mineCount,
            minePercent: minePercent === "true",
            colors,
            connectedNumber: connectedNumber === "true",
            includeCorners: includeCorners === "true",
            autoGenerate: autoGenerate === "true",
        } as MainMenuNewGameOptions);
    }
</script>

<div class="overflow-auto h-screen grid">
    <div class="flex flex-col align-middle w-72 h-fit m-auto">
        <details>
            <summary class="rounded-t-lg">Pattern</summary>

            <select name="type" id="type" bind:value={type}>
                <option value="square">Square Grid</option>
                <option value="hex">Hex Grid</option>
                <option value="fractal">Fractal Grid</option>
            </select>
            <select name="pattern" id="pattern" bind:value={selected}>
                {#each patternsArr as pattern}
                    <option value={pattern}>{patterns.get(pattern).name}</option
                    >
                {/each}
            </select>
            {#if parameters}
                {#each parameters as parameter}
                    {#if parameter.type == "number"}
                        <label class="number-input"
                            >{parameter.name}:
                            <input
                                type="number"
                                bind:value={selectedParameters[
                                    parameter.name.replaceAll(" ", "")
                                ]}
                                min={parameter.min}
                                max={parameter.max}
                                step={parameter.step}
                                name={parameter.name}
                            />
                        </label>
                    {:else if parameter.type == "boolean"}
                        <!-- svelte-ignore a11y-label-has-associated-control -->
                        <label class="boolean-input"
                            >{parameter.name}:
                            <Toggle
                                name={parameter.name}
                                bind:state={selectedParameters[
                                    parameter.name.replaceAll(" ", "")
                                ]}
                                _class="ml-4"
                            />
                        </label>
                    {:else if parameter.type == "select"}
                        <div class="select-input">
                            <span
                                >{parameter.name}:
                                <select
                                    name={parameter.name}
                                    style="border-bottom-width: 0;"
                                    bind:value={selectedParameters[
                                        parameter.name.replaceAll(" ", "")
                                    ]}
                                >
                                    {#each parameter.options as option}
                                        <option value={option}>{option}</option>
                                    {/each}
                                </select>
                            </span>
                        </div>
                    {/if}
                {/each}
            {/if}
        </details>

        <details>
            <summary>Mines</summary>
            <label class="number-input"
                >Mine Count:
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
                >Mine Percent:
                <Toggle
                    name="minePercent"
                    bind:state={minePercent}
                    _class="ml-4"
                />
            </label>
            <label class="number-input"
                >Colors:
                <input
                    type="number"
                    bind:value={colors}
                    min="1"
                    max="7"
                    step="1"
                    name="colors"
                />
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="boolean-input"
                ><abbr
                    title={`Numbers on mines are either of the form -2- or {2}. \
                Dashes around means that not all the mines around the tile are touching eachother. \
                Curly braces means that all the mines around the tile are touching each other.`}
                    >Connected</abbr
                >:
                <Toggle
                    name="connectedNumber"
                    bind:state={connectedNumber}
                    _class="ml-4"
                />
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="boolean-input"
                >Corners:
                <Toggle
                    name="includeCorners"
                    bind:state={includeCorners}
                    _class="ml-4"
                />
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="boolean-input"
                >Auto Generate:
                <Toggle
                    name="autoGenerate"
                    bind:state={autoGenerate}
                    _class="ml-4"
                />
            </label>
        </details>

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
</div>

<style lang="scss">
    * {
        pointer-events: all;
    }

    details {
        @apply flex flex-col align-middle w-full h-fit m-auto;
    }

    button,
    summary {
        @apply bg-gray-800 text-white text-2xl p-2 cursor-pointer text-center;

        &.rounded {
            @apply rounded-lg my-3.5;
        }
    }

    :is(button, summary):hover {
        @apply bg-gray-700;

        &.new-game {
            @apply bg-sky-800;
        }

        &.exit {
            @apply bg-red-800;
        }
    }

    select {
        @apply bg-gray-800 text-white text-2xl w-full p-2 border-b-2 border-gray-900;
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

    .select-input {
        @apply w-full cursor-default h-max my-0;
        @apply bg-gray-800 text-white text-2xl pt-2;
        @apply bg-gray-800 text-white text-2xl border-b-2 border-gray-900;

        span {
            @apply mx-auto;
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
