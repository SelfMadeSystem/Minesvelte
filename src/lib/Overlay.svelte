<script lang="ts">
    import { windowSize } from "./stores";
    import Canvas from "./Canvas.svelte";

    export var borderSize = 25;
    export var borderColor = "red";
</script>

<Canvas>
    <!-- <rect
        x="-{$windowSize.width / 2 - borderSize/2}"
        y="-{$windowSize.height / 2 - borderSize/2}"
        width="{$windowSize.width - borderSize}"
        height="{$windowSize.height - borderSize}"
        fill="none"
        stroke={borderColor}
        stroke-width={borderSize}
    <text x="0" y="-100%" class="text-2xl" dominant-baseline="hanging" text-anchor="middle">
        Hello
    </text>
    /> -->
</Canvas>
