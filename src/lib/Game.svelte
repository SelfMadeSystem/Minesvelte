<script lang="ts">
    import { windowSize } from "./stores";
    import Canvas from "./Canvas.svelte";
    import Grid from "./game/Grid.svelte";
    import { getMousePoint, HexGrid, Point, SquareGrid } from "./utils/Grid";
    import Shape from "./game/Shape.svelte";
    import { Shape as Sh, moveTo, lineTo, ShapePoint } from "./utils/Shape";
    import Dot from "./game/Dot.svelte";
    import Vec from "./utils/Vec";
    var shapes: Sh[] = [];

    var grid = new HexGrid(
        {},
        {
            size: 50,
            offset: new Vec(0, 0),
            shapes,
        }
    );

    function sh(points: ShapePoint[], hasMine: boolean = false) {
        return new Sh(grid, points, hasMine);
    }

    // shapes.push(sh([
    //     moveTo(0, 0),
    //     lineTo(4, 0),
    //     lineTo(4, 4),
    //     lineTo(0, 4),
    //     moveTo(1, 1),
    //     lineTo(3, 1),
    //     lineTo(3, 3),
    //     lineTo(1, 3),
    // ]));

    var gridSize = 15;
    var halfGridSize = Math.floor(gridSize / 2);

    for (let i = 0; i < gridSize * 2 - 1; i++) {
        for (let j = Math.max(0, gridSize - i - 1); j < gridSize * 2 - Math.max(1, i - gridSize + 2); j++) {
            let x = (i - halfGridSize * 1.5) * 2 + j - halfGridSize * 2;
            let y = j - i - halfGridSize;
            shapes.push(
                sh([
                    moveTo(x, y),
                    lineTo(x + 1, y),
                    lineTo(x + 1, y + 1),
                    lineTo(x, y + 2),
                    lineTo(x - 1, y + 2),
                    lineTo(x - 1, y + 1),
                ], Math.random() < 0.125)
            );
        }
    }

    if (shapes) {
        shapes.forEach((s) => s._updateContacts());
    }

    var mousePoint: Point = {
        x: 0,
        y: 0,
    };

    function onMouseMove(e: MouseEvent) {
        const { clientX, clientY } = e;
        mousePoint = getMousePoint(clientX, clientY, grid);
        if (!scrolling) return;
        grid.info.offset = grid.info.offset.add(
            new Vec(e.movementX / grid.info.size, e.movementY / grid.info.size)
        );
    }

    function onMouseWheel(e: WheelEvent) {
        var delta = e.deltaY || e.detail || (e as any).wheelDelta;
        grid.info.size *= Math.pow(1.001, delta);
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
</Canvas>
