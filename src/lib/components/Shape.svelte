<script lang="ts">
    import type { Shape } from "../game/shape";
    import type { Grid } from "../game/grid";
    import { getShapeColorByState } from "../utils/Colors";
    import Vec from "../utils/Vec";
    export let grid: Grid;
    export let shape: Shape;
    let path: SVGPathElement;

    $: state = shape.shapeState;

    $: pathPosition = Vec.from(grid.toVector(shape.getTextPosition()));
    $: text = shape.getText();
    $: hovering = false;
    $: highlighted = state.isHighlighed;

    $: pointsStr = shape.toString();
    $: color = getShapeColorByState(
        shape.shapeState.color,
        shape.shapeState.getState(hovering)
    );
    /* function updatePath() {
        if (path) {
            pathPosition = Vec.from(grid.toVector(shape.getTextPosition()));
        }
        pointsStr = shape.toString();
        text = shape.getText();
    } */

    shape.shapeStateNotify.subscribe((state) => {
        color = getShapeColorByState(state.color, state.getState(hovering));
        highlighted = state.isHighlighed;
        text = shape.getText();
    });

    function onMouseDown(e: MouseEvent) {
        switch (e.button) {
            case 0:
                if (e.shiftKey) {
                    shape.shapeState.hasMine = !shape.shapeState.hasMine;
                    break;
                }
                if (shape.shapeState.isRevealed && !shape.shapeState.hasMine) {
                    let a = shape.contacts.filter(
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

    function mouseEnter(e: MouseEvent) {
        hovering = true; // Fixme: svelte being dum and "efficient" I think
        if (e.altKey) shape.contacts.forEach(s => s.shapeState.isHighlighed = true);
    }

    function mouseLeave(e: MouseEvent) {
        hovering = false;
        shape.contacts.forEach(s => s.shapeState.isHighlighed = false);
    }
</script>

<g>
    <path
        bind:this={path}
        fill-rule="evenodd"
        d={pointsStr}
        fill={highlighted ? color.highlightFill : color.fill}
        stroke={highlighted ? color.highlighStroke : color.stroke}
        stroke-width="0.05"
        stroke-linecap="round"
        stroke-linejoin="round"
        on:mousedown={onMouseDown}
        on:mouseenter={mouseEnter}
        on:mouseleave={mouseLeave}
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
        //     fill: let(--fillHover);
        //     stroke: let(--strokeHover);
        // }
    }
</style>
