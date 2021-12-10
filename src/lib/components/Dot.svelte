<script lang="ts">
    import type { Grid } from "../game/grid";
    import type { Point } from "../utils/Vec";
    export var grid: Grid;
    export var point: Point;
    export var fill: string;
    let pos = grid.toVector(point);
    // grid.transformScale.subscribe(() => {
    //     pos = grid.scale(grid.toVector(point));
    // });
</script>

<circle cx={pos.x} cy={pos.y} r="5" {fill} />
