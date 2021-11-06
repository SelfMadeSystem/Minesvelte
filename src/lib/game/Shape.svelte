<script lang="ts">
    import { moveShapePoint, Shape } from "../utils/Shape";
    import {
        getMousePoint,
        Grid,
        mouseDistFromClosestPoint,
        Point,
    } from "../utils/Grid";
    import { getShapeColorByState } from "../utils/Colors";
    export var grid: Grid;
    export var shape: Shape;
    var clicking = false;
    var dragging = -1;
    var clickPoint: Point;
    $: pointsStr = shape.toString();
    $: color = getShapeColorByState(
        shape.shapeInfo.color,
        shape.shapeInfo.getState(false)
    );
    $: {
        grid.info
        pointsStr = shape.toString();
    }

    function onMouseDown(e: MouseEvent) {
        switch (e.button) {
            case 0:
                clicking = true;
                e.preventDefault();
                e.stopPropagation();
                clickPoint = getMousePoint(e.clientX, e.clientY, grid);
                var d = mouseDistFromClosestPoint(
                    e.clientX,
                    e.clientY,
                    grid,
                    shape.points
                );
                if (d < 0.5) {
                    dragging = shape.points.findIndex(
                        (p) => p.x === clickPoint.x && p.y === clickPoint.y
                    );
                } else {
                    dragging = -1;
                }
                break;
            case 2:
                if (e.altKey) {
                    console.log(shape.contacts)
                } else {
                    shape.shapeInfo.isFlagged = true;
                    shape.contacts.forEach((c) => {
                        c.shapeInfo.isRevealed = true;
                        c.shapeInfo.isFlagged = false;
                    });
                    e.preventDefault();
                    e.stopPropagation();
                }
                break;
            case 1:
                console.log(shape.shapeInfo.getState(false));
                e.preventDefault();
                e.stopPropagation();
        }
    }

    function onMouseUp(e: MouseEvent) {
        if (clicking && e.button === 0) {
            clicking = false;
            e.preventDefault();
            e.stopPropagation();
        }
    }

    function onMouseMove(e: MouseEvent) {
        if (!clicking) return;
        if (e.buttons === 0) {
            clicking = false;
            return;
        }
        const { clientX, clientY } = e;
        const { x, y } = getMousePoint(clientX, clientY, grid);
        var diff = { x: x - clickPoint.x, y: y - clickPoint.y };
        if (diff.x === 0 && diff.y === 0) return;
        if (dragging >= 0) {
            clickPoint = { x, y };
            if (dragging === -1) return;
            var point = grid.getPoint(x, y);
            shape.points[dragging].x = point.x;
            shape.points[dragging].y = point.y;
        } else {
            clickPoint = { x, y };
            shape.points.forEach((p) =>
                moveShapePoint(p, grid.getPoint(p.x + diff.x, p.y + diff.y))
            );
        }
        pointsStr = shape.toString();
        shape.updateContacts();
    }
</script>

<path
    fill-rule="evenodd"
    d={pointsStr}
    fill={color.fill}
    stroke={color.stroke}
    stroke-width="4"
    stroke-linecap="round"
    stroke-linejoin="round"
    on:mousedown={onMouseDown}
    on:mouseup={onMouseUp}
/>

<svelte:window on:mousemove={onMouseMove} />

<style lang="scss">
    path {
        pointer-events: fill;

        // &:hover {
        //     fill: var(--fillHover);
        //     stroke: var(--strokeHover);
        // }
    }
</style>
