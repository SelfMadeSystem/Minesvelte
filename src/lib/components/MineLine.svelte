<script lang="ts">
    import type { Grid } from "../game/grid";
    import type { MineLine } from "../game/mineLine";

    export let line: MineLine;
    export var grid: Grid;
    let pos = line.getTextPosition();
    let text = line.getText();
    let pos1 = grid.toVector(line.getLine(10000).p1);
    let pos2 = grid.toVector(line.getLine(10000).p2);
</script>

<g>
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
        stroke="black"
        stroke-width="0.075"
    />
</g>
