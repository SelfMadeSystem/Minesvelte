<script lang="ts">
    import type { Shape } from "../game/shape";
    import type { Grid } from "../game/grid";
    import { getShapeColorByState, BG_COLOR } from "../utils/Colors";
    import Vec from "../utils/Vec";
    export let grid: Grid;
    export let shape: Shape;

    $: state = shape.shapeState;

    $: pathPosition = Vec.from(grid.toVector(shape.getTextPosition()));
    $: text = shape.getText();
    $: hovering = false;

    $: fontSize = shape.getTextSize();

    $: pointsStr = shape.toString();
    $: color = getShapeColorByState(shape.shapeState, hovering);
    /* function updatePath() {
        if (path) {
            pathPosition = Vec.from(grid.toVector(shape.getTextPosition()));
        }
        pointsStr = shape.toString();
        text = shape.getText();
    } */

    shape.shapeStateNotify.subscribe((state) => {
        color = getShapeColorByState(shape.shapeState, hovering);
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
                if (shape.shapeState.getState() == "normal") shape.reveal();
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
        hovering = true;
        if (e.ctrlKey)
            shape.contacts.forEach((s) =>
                s.shapeState.setHighlighed(shape, true)
            );
    }

    function mouseLeave(e: MouseEvent) {
        hovering = false;
        shape.contacts.forEach((s) => s.shapeState.setHighlighed(shape, false));
    }
</script>

<defs>
    <path
        id="path_{shape.id}"
        class="mainPath"
        fill-rule="evenodd"
        d={pointsStr}
    />
    <clipPath id="clip_{shape.id}">
        <use xlink:href="#path_{shape.id}" />
    </clipPath>
</defs>

<g>
    <use
        xlink:href="#path_{shape.id}"
        fill={color.fill}
        stroke={color.stroke}
        stroke-width="0.2"
        clip-path="url(#clip_{shape.id})"
    />
    <use
        xlink:href="#path_{shape.id}"
        fill="#0000"
        stroke={BG_COLOR}
        stroke-width="0.075"
        clip-path="url(#clip_{shape.id})"
        style="pointer-events: fill;"
        on:mousedown={onMouseDown}
        on:mouseenter={mouseEnter}
        on:mouseleave={mouseLeave}
    />
    <use
        xlink:href="#path_{shape.id}"
        fill="#0000"
        stroke={BG_COLOR}
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="0.045"
    />
    <!-- <path
        class="mainPath"
        fill-rule="evenodd"
        d={pointsStr}
        fill={color.fill}
        stroke={color.stroke}
        stroke-width="0"
        stroke-linecap="round"
        stroke-linejoin="round"
        on:mousedown={onMouseDown}
        on:mouseenter={mouseEnter}
        on:mouseleave={mouseLeave}
    /> -->
    <!-- num > 0 && path && pathPosition && shape.shapeState.isRevealed && !shape.shapeState.hasMine -->
    {#if text}
        <text
            x={pathPosition.x}
            y={pathPosition.y}
            text-anchor="middle"
            dominant-baseline="central"
            font-size={fontSize}
            font-family="monospace"
            fill="#e9e9e9"
        >
            {text}
        </text>
    {/if}
</g>

<style>
    /* .mainPath {
        pointer-events: fill;
        filter: url(#shadow);
    } */
</style>
