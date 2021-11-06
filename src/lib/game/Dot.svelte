<script lang="ts">
    import type { Grid, Point } from "../utils/Grid";
    export var grid: Grid;
    export var point: Point;
    export var fill: string;
    $: pos = grid.applyToVector(grid.toVectorPoint(point));
</script>

<circle cx={pos.x} cy={pos.y} r="5" {fill} />
