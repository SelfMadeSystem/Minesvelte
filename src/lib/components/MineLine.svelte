<script lang="ts">
    import type { Grid } from "../game/grid";
    import type { MineLine } from "../game/mineLine";

    export let line: MineLine;
    export var grid: Grid;
    const hoverColor = "#fff5";
    const clickedColor = "#fffb";
    let lineColor = "#0000";
    let clicked = false;
    let pos = line.getTextPosition();
    let text = line.getText();
    let pos1 = grid.toVector(line.getLine(10000).p1);
    let pos2 = grid.toVector(line.getLine(10000).p2);

    function mouseEnter() {
        if (!clicked) {
            lineColor = hoverColor;
        }
        line.contacts.forEach((s) => (s.shapeState.setHighlighed(line, true)));
    }

    function mouseLeave() {
        if (!clicked) {
            lineColor = "#0000";
            line.contacts.forEach((s) => (s.shapeState.setHighlighed(line, false)));
        }
    }

    function onClick() {
        clicked = !clicked;
        if (clicked) {
            lineColor = clickedColor;
            line.contacts.forEach((s) => (s.shapeState.setHighlighed(line, true)));
        } else lineColor = hoverColor;
    }
</script>

<g>
    <circle
        on:mouseenter={mouseEnter}
        on:mouseleave={mouseLeave}
        on:click={onClick}
        cx={pos.x}
        cy={pos.y}
        r="0.4"
        fill="#fff6"
        style="pointer-events: fill;"
    />
    <text
        x={pos.x}
        y={pos.y}
        text-anchor="middle"
        dominant-baseline="central"
        font-size="0.5"
        font-family="monospace"
        fill="white">{text}</text
    >
    <line
        x1={pos1.x}
        y1={pos1.y}
        x2={pos2.x}
        y2={pos2.y}
        stroke={lineColor}
        stroke-linecap="round"
        stroke-width="0.075"
    />
</g>
