<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import { HexGrid, SquareGrid } from "../game/grid";
    import Shape from "./Shape.svelte";
    import MineLine from "./MineLine.svelte";
    import type { Shape as Sh } from "../game/shape";
    import { MineLine as Ml } from "../game/mineLine";
    import Vec, { Point } from "../utils/Vec";
    import { windowSize } from "../stores";
    import * as squarePatterns from "../patterns/squarePatterns";
    import * as hexPatterns from "../patterns/hexPatterns";
    import { Solver } from "../game/solver";
    import { specifics, strokeColors } from "../utils/Colors";
    import PauseMenu from "./menus/PauseMenu.svelte";
    import type { MainMenuNewGameOptions } from "../utils/Events";
    export let options: MainMenuNewGameOptions;

    var grid = options.grid;

    var shapes: Sh[] = grid.shapes;
    var mineLines = grid.mineLines;
    var minesLeft: number = 0;
    // let s3o2 = Math.sqrt(3) / 2;
    // mineLines.push(new Ml(grid, { x: -1, y: 0.5 }, 0));
    // mineLines.push(new Ml(grid, {x: -0.5 - s3o2, y: 0.5 + 1 * (1.5 + s3o2)}, 0));
    // mineLines.push(new Ml(grid, {x: 0, y: 0.5 + 2 * (1.5 + s3o2)}, 0));
    // mineLines.push(new Ml(grid, {x: -0.5 - s3o2, y: 0.5 + 3 * (1.5 + s3o2)}, 0));
    // mineLines.push(new Ml(grid, {x: 0, y: 0.5 + 4 * (1.5 + s3o2)}, 0));
    // mineLines.push(new Ml(grid, {x: -0.5 - s3o2, y: 0.5 + 5 * (1.5 + s3o2)}, 0));
    // mineLines.push(new Ml(grid, {x: 0, y: 0.5 + 6 * (1.5 + s3o2)}, 0));

    grid.transformScaleAdjust.value = 50;

    options.pattern.generateGrid(grid, options.patternSize);

    grid.resetShapes();
    minesLeft = options.minePercent
        ? grid.setMineRatio(options.mineCount / 100)
        : grid.setRandomMines(options.mineCount);
    grid.centerOnScreen();

    mineLines.forEach((ml) => ml.updateContacts());

    for (let i = 0; i < shapes.length; i++) {
        // Todo: add colour stuffs
        // shapes[i].shapeState.color =
        //     strokeColors[Math.floor((i / shapes.length) * strokeColors.length)];
        // let s = shapes[i];
        // if (s.A_hexPosition.q == 1) {
        //     s.shapeState.color = strokeColors[1];
        // }
    }

    var shapesByColor = grid.shapesByColor();

    grid.notifyShapeStateChange.subscribe(
        (() => {
            var _ = () => {
                minesLeft = grid.getMinesLeft();
                shapesByColor = grid.shapesByColor();
            };
            _();
            return _;
        })()
    );

    if (shapes) {
        shapes.forEach((s) => s._updateContacts());
    }

    // var mousePoint: Point = {
    //     x: 0,
    //     y: 0,
    // };

    function onMouseMove(e: MouseEvent) {
        const { offsetX, offsetY, movementX, movementY } = e;
        // mousePoint = getMousePoint(clientX, clientY, grid);
        if (e.ctrlKey)
            console.log(offsetX, offsetY, grid.fromMousePos(offsetX, offsetY));
        if (!scrolling) return;
        grid.transformPosition.value = Vec.from(
            grid.transformPosition.value
        ).add(
            new Vec(movementX, movementY).scale(1 / grid.transformScale.value)
        );
    }

    function onMouseWheel(e: WheelEvent) {
        var delta = e.deltaY || e.detail || (e as any).wheelDelta;
        grid.transformScale.value *= 1 + delta / 1000;
        grid.transformPosition.value = Vec.from(
            grid.transformPosition.value
        ).add(
            new Vec(
                e.offsetX - windowSize.width / 2,
                e.offsetY - windowSize.height / 2
            ).scale(((-delta / 1000) * 1) / grid.transformScale.value)
        );
    }

    document.addEventListener("wheel", onMouseWheel, false);
    document.addEventListener("DOMMouseScroll", onMouseWheel, false);

    var scrolling = false;
    let paused = false;

    function onMouseDown(e: MouseEvent) {
        if (paused) {
            return;
        }
        if (e.button === 0) {
            scrolling = true;
        }
        e.preventDefault();
    }

    function onMouseUp(e: MouseEvent) {
        if (paused) {
            return;
        }
        if (e.button === 0) {
            scrolling = false;
        }
        e.preventDefault();
    }

    function onKeyDown(e: KeyboardEvent) {
        console.log(e.key);
        switch (e.key) {
            case "Escape":
                paused = !paused;
                break;
            case "u":
                grid.history.undo();
                break;
            case "r":
                grid.history.redo();
                break;
        }
    }

    let offsetCanvas: Point = { x: 0, y: 0 };
    let offsetAdjust: Point = { x: 0, y: 0 };
    let scaleAdjust = 50;
    let scale = 1;

    grid.transformPosition.subscribe((v) => {
        offsetCanvas = v;
    });
    grid.transformPositionAdjust.subscribe((v) => {
        offsetAdjust = v;
    });
    grid.transformScaleAdjust.subscribe((v) => {
        scaleAdjust = v;
    });
    grid.transformScale.subscribe((v) => {
        scale = v;
    });

    function solve() {
        new Solver(grid).solve();
    }

    function makeSolvable() {
        grid.makeSolvable();
    }
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
    on:keydown={onKeyDown}
/>

{#if paused}
    <PauseMenu
        on:game-resume={() => (paused = false)}
        on:menu
        on:game-new-game
    />
{/if}

<!-- Keeps the objects rendered so it won't take forever to unpause -->
<span class:invisible={paused}>
    <Canvas
        {offsetCanvas}
        offsetAdjust1={{ x: 50, y: 50 }}
        offsetAdjust2={offsetAdjust}
        {scale}
        {scaleAdjust}
    >
        <g id="shapes">
            {#each shapes as shape (shape.id)}
                <!-- remove this nonsense -->
                <Shape {grid} {shape} />
            {/each}
        </g>
        <g id="lines">
            {#each mineLines as line}
                <!-- remove this nonsense -->
                <MineLine {grid} {line} />
            {/each}
        </g>
        <!-- <g id="owo">
    {#each shapes[0].getPoints() as point }
        <Dot {grid} {point} fill="red" />
    {/each}
    </g> -->
        <!-- <Dot {grid} point={mousePoint} fill={"purple"} /> -->
    </Canvas>

    <div
        class="text-3xl font-semibold text-white font-mono top-2 right-4 bg-[#0007] border-x-8 border-y-2 rounded border-transparent z-10 absolute"
    >
        {minesLeft}
    </div>
    {#each Object.keys(shapesByColor) as color, i}
        <div
            class="text-3xl font-semibold right-4 font-mono bg-[#0007] border-x-8 border-y-2 rounded border-transparent z-10 absolute"
            style="top: {(i + 1) * 3 + 0.5}rem;
        color: {specifics[color].normal};"
        >
            {shapesByColor[color].filter((s) => s.shapeState.hasMine).length -
                shapesByColor[color].filter((s) => s.shapeState.mineKnown)
                    .length}
        </div>
    {/each}
    <button
        on:click={solve}
        class="text-3xl font-semibold text-white text-center absolute top-0 z-10 border-2"
    >
        Solve
    </button>
    <button
        on:click={makeSolvable}
        class="text-3xl font-semibold text-white text-center absolute top-0 left-24 z-10 border-2"
    >
        Make Solvable
    </button>
</span>
