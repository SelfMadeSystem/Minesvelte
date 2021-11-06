<script lang="ts">
    import type { Grid } from "../utils/Grid";
    import Dot from "./Dot.svelte";
    export var grid: Grid;
</script>

{#each $grid as point}
    <Dot {grid} {point} fill={"green"}/>
{/each}