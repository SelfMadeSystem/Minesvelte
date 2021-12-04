<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import Grid from "./Grid.svelte";
    import { getMousePoint, HexGrid, SquareGrid } from "../game/grid";
    import Shape from "./Shape.svelte";
    import type { Shape as Sh } from "../game/shape";
import Vec, { Point } from "../utils/Vec";
    var grid = new SquareGrid();

    var shapes: Sh[] = grid.shapes;

    grid.transformScale.value = 50;

    grid.generateDefaultGrid(10);
    grid.setMineRatio(0.16);
    grid.centerOnScreen();

    if (shapes) {
        shapes.forEach((s) => s._updateContacts());
    }

    // var mousePoint: Point = {
    //     x: 0,
    //     y: 0,
    // };

    function onMouseMove(e: MouseEvent) {
        const { clientX, clientY, movementX, movementY } = e;
        // mousePoint = getMousePoint(clientX, clientY, grid);
        if (!scrolling) return;
        grid.transformPosition.value = Vec.from(grid.transformPosition.value).add(new Vec(movementX, movementY));
    }

    function onMouseWheel(e: WheelEvent) {
        var delta = e.deltaY || e.detail || (e as any).wheelDelta;
        grid.transformScale.value *= 1 + delta / 1000;
    }

    document.addEventListener("mousewheel", onMouseWheel, false);
    document.addEventListener("DOMMouseScroll", onMouseWheel, false);

    var scrolling = false;
    function onMouseDown(e: MouseEvent) {
        if (e.button === 0) {
            scrolling = true;
        }
        e.preventDefault();
    }

    function onMouseUp(e: MouseEvent) {
        if (e.button === 0) {
            scrolling = false;
        }
        e.preventDefault();
    }

    let offset: Point = { x: 0, y: 0 };
    let scale = 50;

    grid.transformPosition.subscribe((v) => {
        offset = v;
    });
    grid.transformScale.subscribe((v) => {
        scale = v;
    });
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
/>

<Canvas {offset} {scale}>
    <g id="grid">
        <Grid {grid} />
    </g>
    <g id="shapes">
        {#each shapes as shape}
            <!-- remove this nonsense -->
            <Shape {grid} {shape} />
        {/each}
    </g>
    <!-- <g id="owo">
        {#each shapes[0].getPoints() as point }
            <Dot {grid} {point} fill="red" />
        {/each}
    </g> -->
    <!-- <Dot {grid} point={mousePoint} fill={"purple"} /> -->
    <text
        x="99%"
        y="-99%"
        class="text-3xl font-semibold"
        fill="white"
        stroke="black"
        dominant-baseline="hanging"
        text-anchor="end"
    >
        <!-- {grid.info.getShapeCountWithMines() - gsid} -->
    </text>
</Canvas>
