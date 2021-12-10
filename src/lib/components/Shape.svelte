<script lang="ts">
    import { afterUpdate, tick } from "svelte";
    import type { moveShapePoint, Shape } from "../game/shape";
    import {
        getMousePoint,
        Grid,
        mouseDistFromClosestPoint
    } from "../game/grid";
    import { getShapeColorByState } from "../utils/Colors";
    import Vec from "../utils/Vec";
    import type { Point } from "../utils/Vec";
    export var grid: Grid;
    export var shape: Shape;
    var clicking = false;
    var dragging = -1;
    var clickPoint: Point;
    var path: SVGPathElement;

    var pathPosition: Vec;
    var num: number;
    var zIndex: number = 1;

    $: pointsStr = shape.toString();
    $: color = getShapeColorByState(
        shape.shapeState.color,
        shape.shapeState.getState(false)
    );
    $: {
        grid;
        pointsStr = shape.toString();
    }
    function updatePath() {
        if (path) {
            pathPosition = Vec.from(grid.toVector(shape.getCenter()));
        }
        pointsStr = shape.toString();
        num = shape.number;
    }

    shape.shapeStateNotify.subscribe((state) => {
        color = getShapeColorByState(
            state.color,
            state.getState(false)
        );
        updatePath();
        zIndex = state.getZIndex(false);
    });

    afterUpdate(() => {
        updatePath();
    });

    function onMouseDown(e: MouseEvent) {
        switch (e.button) {
            case 0:
                if (e.shiftKey) {
                    // clicking = true;
                    // e.preventDefault();
                    // e.stopPropagation();
                    // clickPoint = getMousePoint(e.clientX, e.clientY, grid);
                    // var d = mouseDistFromClosestPoint(
                    //     e.clientX,
                    //     e.clientY,
                    //     grid,
                    //     shape.points
                    // );
                    // if (d < 0.5) {
                    //     dragging = shape.points.findIndex(
                    //         (p) => p.x === clickPoint.x && p.y === clickPoint.y
                    //     );
                    // } else {
                    //     dragging = -1;
                    // }
                    shape.shapeState.hasMine = !shape.shapeState.hasMine;
                    break;
                }
                if (shape.shapeState.isRevealed && !shape.shapeState.hasMine) {
                    var a = shape.contacts.filter((c) => c.shapeState.isFlagged || (c.shapeState.hasMine && c.shapeState.isRevealed));
                    if (a.length == shape.number) {
                        shape.contacts.filter((c) => !(c.shapeState.isFlagged || (c.shapeState.hasMine && c.shapeState.isRevealed))).forEach((c) => {
                            c.reveal();
                        });
                    }
                    return;
                }
                if (shape.shapeState.getState(false) == "normal") shape.reveal();
                break;
            case 2:
                shape.shapeState.isFlagged = !shape.shapeState.isFlagged;
                break;
            case 1:
                shape.shapeState.hasMine = !shape.shapeState.hasMine;
                break;
        }
        /* switch (e.button) {
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
                    console.log(shape.contacts);
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
        } */
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
            // var point = grid.getPoint(x, y);
            // shape.points[dragging].x = point.x;
            // shape.points[dragging].y = point.y;
        } else {
            clickPoint = { x, y };
            // shape.points.forEach((p) =>
            //     moveShapePoint(p, grid.getPoint(p.x + diff.x, p.y + diff.y))
            // );
        }
        pointsStr = shape.toString();
        shape.updateContacts();
        // shape.contacts.forEach((c) => {
        //     c.callback(c);
        // });
    }
</script>

<g>
    <path
        bind:this={path}
        fill-rule="evenodd"
        d={pointsStr}
        fill={color.fill}
        stroke={color.stroke}
        stroke-width="0.05"
        stroke-linecap="round"
        stroke-linejoin="round"
        on:mousedown={onMouseDown}
        on:mouseup={onMouseUp}
    />
    {#if (num > 0) && path && pathPosition && shape.shapeState.isRevealed && !shape.shapeState.hasMine}
        <text
            x={pathPosition.x}
            y={pathPosition.y}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="0.5"
            font-family="monospace"
            fill={color.stroke}
        >
            {num}
        </text>
    {/if}
</g>

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
