<script lang="ts">
    import { afterUpdate, tick } from "svelte";
    import type { moveShapePoint, Shape } from "../game/shape";
    import type { Grid } from "../game/grid";
    import { getShapeColorByState } from "../utils/Colors";
    import Vec from "../utils/Vec";
    import type { Point } from "../utils/Vec";
    export var grid: Grid;
    export var shape: Shape;
    var path: SVGPathElement;

    var pathPosition: Vec;
    var text: string;
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
            pathPosition = Vec.from(grid.toVector(shape.getTextPosition()));
        }
        pointsStr = shape.toString();
        text = shape.getText();
    }

    shape.shapeStateNotify.subscribe((state) => {
        color = getShapeColorByState(state.color, state.getState(false));
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
                    shape.shapeState.hasMine = !shape.shapeState.hasMine;
                    break;
                }
                if (shape.shapeState.isRevealed && !shape.shapeState.hasMine) {
                    var a = shape.contacts.filter(
                        (c) =>
                            c.shapeState.isFlagged ||
                            (c.shapeState.hasMine && c.shapeState.isRevealed)
                    );
                    if (a.length == shape.number) {
                        shape.contacts
                            .filter(
                                (c) =>
                                    !(
                                        c.shapeState.isFlagged ||
                                        (c.shapeState.hasMine &&
                                            c.shapeState.isRevealed)
                                    )
                            )
                            .forEach((c) => {
                                c.reveal();
                            });
                    }
                    return;
                }
                if (shape.shapeState.getState(false) == "normal")
                    shape.reveal();
                break;
            case 2:
                shape.shapeState.isFlagged = !shape.shapeState.isFlagged;
                break;
            case 1:
                shape.shapeState.hasMine = !shape.shapeState.hasMine;
                break;
        }
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
    />
    <!-- num > 0 && path && pathPosition && shape.shapeState.isRevealed && !shape.shapeState.hasMine -->
    {#if text }
        <text
            x={pathPosition.x}
            y={pathPosition.y}
            text-anchor="middle"
            dominant-baseline="central"
            font-size="0.5"
            font-family="monospace"
            fill={color.stroke}
        >
            {text}
        </text>
    {/if}
</g>

<style lang="scss">
    path {
        pointer-events: fill;

        // &:hover {
        //     fill: var(--fillHover);
        //     stroke: var(--strokeHover);
        // }
    }
</style>
