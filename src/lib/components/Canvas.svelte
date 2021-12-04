<script lang="ts">
    import type { Point } from "../utils/Vec";

    export let offset: Point = { x: 0, y: 0 };
    export let scale: number = 1;
</script>

<svg
    class="absolute"
    width="100vw"
    height="100vh"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
    style="transform: translate({offset.x}px, {offset.y}px)"
>
    <g
    transform="scale({scale})"
    >
        <slot />
    </g>
</svg>
