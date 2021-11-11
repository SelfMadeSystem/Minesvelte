<script lang="ts">
    import type { Grid } from "../utils/Grid";
    import type { Point } from "../utils/Vec";
    export var grid: Grid;
    export var point: Point;
    export var fill: string;
    $: pos = grid.applyMatrix(grid.toVector(point));
    grid.tranformMatrix.subscribe(() => {
        pos = grid.applyMatrix(grid.toVector(point));
    });
</script>

<circle cx={pos.x} cy={pos.y} r="5" {fill} />
