<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import { SquareGrid } from "../game/grid";
    import Shape from "./Shape.svelte";
    import MineLine from "./MineLine.svelte";
    import type { Shape as Sh } from "../game/shape";
    import { MineLine as Ml } from "../game/mineLine";
    import Vec, { type Point } from "../utils/Vec";
    import { windowSize } from "../stores";
    import * as squarePatterns from "../patterns/squarePatterns";
    import * as hexPatterns from "../patterns/hexPatterns";
    import { Solver } from "../game/solver";
    import { specifics, strokeColors } from "../utils/Colors";
    import PauseMenu from "./menus/PauseMenu.svelte";
    import type { MainMenuNewGameOptions } from "../utils/Events";
    export let options: MainMenuNewGameOptions;

    let grid = options.grid;

    let shapes: Sh[] = grid.shapes;
    let mineLines = grid.mineLines;
    let minesLeft: number = 0; // TODO: Customize this too
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

    grid.reset(options);
    minesLeft = grid.getMinesLeft();
    grid.centerOnScreen();

    mineLines.forEach((ml) => ml.updateContacts());

    // for (let i = 0; i < shapes.length; i++) {
    //     // Todo: add colour stuffs
    //     shapes[i].shapeState.color =
    //         strokeColors[Math.floor((i / shapes.length) * strokeColors.length)];
    //     let s = shapes[i];
    //     if (s.A_hexPosition) {
    //         if (s.A_hexPosition.q == 1) {
    //             s.shapeState.color = strokeColors[1];
    //         }
    //     }
    // }

    let shapesByColor = grid.shapesByColor();

    grid.notifyShapeStateChange.subscribe(
        (() => {
            let _ = () => {
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

    // let mousePoint: Point = {
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
        let delta = e.deltaY || e.detail || (e as any).wheelDelta;
        if (e.ctrlKey) {
            e.preventDefault();
            delta *= -4;
        }

        console.log(grid.transformPosition.value);

        const sub = Vec.from({
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
        }).sub(grid.transformPosition.value);

        const prevMouseVec = Vec.from({
            x: e.offsetX,
            y: e.offsetY,
        })
            .sub(sub)
            .scale(-1 / grid.transformScale.value);

        if (delta > 0) {
            grid.transformScale.value *= 1 + delta / 1000;
        } else {
            grid.transformScale.value /= 1 - delta / 1000;
        }

        const mouseVec = Vec.from({
            x: e.offsetX,
            y: e.offsetY,
        })
            .sub(sub)
            .scale(-1 / grid.transformScale.value);

        // TODO: Uncomment when fixed
        // grid.transformPosition.value = Vec.from(
        //     grid.transformPosition.value
        // ).add(prevMouseVec.sub(mouseVec));
    }

    document.addEventListener("wheel", onMouseWheel, { passive: false });
    document.addEventListener("DOMMouseScroll", onMouseWheel, false);

    let scrolling = false;
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

    const solver = new Solver(grid);

    function solve() {
        if (solver.solving) {
            solver.cancel();
        } else {
            solver.solve();
        }
    }

    function hint() {
        solver.hint();
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
    <div class="absolute flex top-0 left-0 gap-4">
        <button
            on:click={solve}
            class="text-3xl font-semibold text-white text-center z-10 border-2"
        >
            Solve
        </button>
        <button
            on:click={hint}
            class="text-3xl font-semibold text-white text-center z-10 border-2"
        >
            Hint
        </button>
        <button
            on:click={makeSolvable}
            class="text-3xl font-semibold text-white text-center z-10 border-2"
        >
            Make Solvable
        </button>
    </div>
</span>
