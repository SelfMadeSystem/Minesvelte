<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import Grid from "./game/Grid.svelte";
    import { getMousePoint, HexGrid, SquareGrid } from "./utils/Grid";
    import Shape from "./game/Shape.svelte";
    import type { Shape as Sh } from "./utils/Shape";
    import Dot from "./game/Dot.svelte";
    import type { Point } from "./utils/Vec";
    var grid = new HexGrid();

    var shapes: Sh[] = grid.shapes;

    grid.tranformMatrix.scale(50, 50);

    grid.generateTriangleGrid(20);
    grid.setMineRatio(0.16);

    if (shapes) {
        shapes.forEach((s) => s._updateContacts());
    }

    var mousePoint: Point = {
        x: 0,
        y: 0,
    };

    function onMouseMove(e: MouseEvent) {
        const { clientX, clientY, movementX, movementY } = e;
        mousePoint = getMousePoint(clientX, clientY, grid);
        if (!scrolling) return;
        grid.tranformMatrix.translate(movementX, movementY);
    }

    function onMouseWheel(e: WheelEvent) {
        var delta = e.deltaY || e.detail || (e as any).wheelDelta;
        grid.tranformMatrix.scale(1 + delta / 1000, 1 + delta / 1000);
    }

    document.addEventListener("mousewheel", onMouseWheel, false);
    document.addEventListener("DOMMouseScroll", onMouseWheel, false);

    var scrolling = false;
    function onMouseDown(e: MouseEvent) {
        scrolling = true;
        e.preventDefault();
    }

    function onMouseUp(e: MouseEvent) {
        scrolling = false;
        e.preventDefault();
    }
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
/>

<Canvas>
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
    <Dot {grid} point={mousePoint} fill={"purple"} />
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
