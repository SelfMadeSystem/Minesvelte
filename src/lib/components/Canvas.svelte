<script lang="ts">
    export let offsetCanvas = { x: 0, y: 0 };
    export let offsetCanvasZoom = { x: 0, y: 0 };
    export let offsetAdjust1 = { x: 0, y: 0 };
    export let offsetAdjust2 = { x: 0, y: 0 };
    export let scale: number = 1;
    export let scaleAdjust: number = 1;
</script>

<svg
    class="absolute"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    overflow="visible"
    style="transform: 
        translate({offsetCanvasZoom.x}px, {offsetCanvasZoom.y}px)
        scale({scale})
        translate({offsetCanvas.x}px, {offsetCanvas.y}px)"
>
    <g
        transform="
    translate({offsetAdjust1.x} {offsetAdjust1.y})
    scale({scaleAdjust})
    translate({offsetAdjust2.x} {offsetAdjust2.y})
    "
    >
        <slot />
    </g>
</svg>
