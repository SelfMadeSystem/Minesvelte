<script lang="ts">
    import Canvas from "./Canvas.svelte";
    import Grid from "./Grid.svelte";
    import { getMousePoint, HexGrid, SquareGrid } from "../game/grid";
    import Shape from "./Shape.svelte";
    import type { Shape as Sh } from "../game/shape";
    import Vec, { Point } from "../utils/Vec";
    import { windowSize } from "../stores";
    var grid = new SquareGrid();

    var shapes: Sh[] = grid.shapes;

    grid.transformScaleAdjust.value = 50;

    grid.generateDefaultGrid(20);
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
        const { offsetX, offsetY, movementX, movementY } = e;
        // mousePoint = getMousePoint(clientX, clientY, grid);
        if (e.ctrlKey)
            console.log(offsetX, offsetY, grid.fromMousePos(offsetX, offsetY));
        if (!scrolling) return;
        grid.transformPosition.value = Vec.from(
            grid.transformPosition.value
        ).add(new Vec(movementX, movementY).scale(1/grid.transformScale.value));
    }

    function onMouseWheel(e: WheelEvent) {
        var delta = e.deltaY || e.detail || (e as any).wheelDelta;
        console.log(delta);
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
</script>

<svelte:window
    on:mousemove={onMouseMove}
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
/>

<Canvas
    {offsetCanvas}
    offsetAdjust1={{ x: 50, y: 50 }}
    offsetAdjust2={offsetAdjust}
    {scale}
    {scaleAdjust}
>
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
