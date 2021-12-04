<script lang="ts" context="module">
</script>

<script lang="ts">
    import type { Grid } from "../game/grid";
    import type { Point } from "../utils/Vec";
    import Dot from "./Dot.svelte";
    export var grid: Grid;
    let points: Point[] = [];

    grid.notifyNewPoint.subscribe(({newPoint}) => {
        points.push(newPoint);
        render();
    });
</script>

{#each points as point}
    <Dot {grid} {point} fill={"green"} />
{/each}
