<script lang="ts" context="module">
    export type State = "true" | "false" | "indeterminate" | true | false;
</script>

<script lang="ts">
    import Color from "color";
    import type { Point } from "src/lib/utils/Vec";
    export let name: string;
    export let state: State;
    export let disableColor: Color = new Color("#900");
    export let indeterminateColor: Color = new Color("#777");
    export let enableColor: Color = new Color("#090");
    export let _class: string = "";
    export let style: string = "";
    export function setState(s: State) {
        state = s;
        switch (state) {
            case "true":
                moveTo(1);
                break;
            case "false":
                moveTo(0);
                break;
            case "indeterminate":
                moveTo(0.5);
                break;
        }
    }
    export function toggle() {
        setState((state === "true" || state === true) ? "false" : "true");
    }

    let slider: HTMLSpanElement;

    let dragPercent: number;
    let color: Color;

    function setPercent(percent: number) {
        dragPercent = Math.max(0, Math.min(1, percent));
        color = indeterminateColor.mix(
            dragPercent < 0.5 ? disableColor : enableColor,
            2 * Math.abs(dragPercent - 0.5)
        );
    }

    let prevMoveID: number;

    function moveTo(percent: number, delta: number = 0) {
        percent = Math.max(0, Math.min(1, percent));
        if (prevMoveID) {
            cancelAnimationFrame(prevMoveID);
        }

        let newPercent = percent;

        if (dragPercent < percent) {
            newPercent = Math.min(dragPercent + 0.01 * delta, percent);
        } else {
            newPercent = Math.max(dragPercent - 0.01 * delta, percent);
        }

        let time = Date.now();

        setPercent(newPercent);

        if (dragPercent === percent) {
            if (percent === 0) {
                state = "false";
            } else if (percent === 1) {
                state = "true";
            } else {
                state = "indeterminate";
            }
            return;
        }

        prevMoveID = requestAnimationFrame(() => {
            prevMoveID = 0;
            let delta = Date.now() - time;
            moveTo(percent, delta);
        });
    }

    switch (state) {
        case "true":
        case true:
            setPercent(1);
            break;
        case "false":
        case false:
            setPercent(0);
            break;
        case "indeterminate":
        default:
            setPercent(0.5);
            break;
    }

    let startMouse: Point;
    let startPercent: number;
    let startTime: number;

    function onMouseDown(e: MouseEvent) {
        startMouse = { x: e.clientX, y: e.clientY };
        startPercent = dragPercent;
        startTime = Date.now();
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }

    function onMouseMove(e: MouseEvent) {
        let w = slider.clientWidth;
        let x = e.clientX - startMouse.x;
        let percent = startPercent + x / w;
        setPercent(percent);
    }

    function onMouseUp(e: MouseEvent) {
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
        var pos = { x: e.clientX, y: e.clientY };
        if (
            (state !== "indeterminate" && startTime + 200 > Date.now()) ||
            Math.abs(pos.x - startMouse.x) < 5
        ) {
            toggle();
        } else {
            if (dragPercent < 0.5) {
                setState("false");
            } else {
                setState("true");
            }
        }
    }
</script>

<input type="hidden" {name} value={state} />

<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<span
    class="slider {state} {_class}"
    style="background-color: {color.toString()}; {style}"
    tabindex="0"
    bind:this={slider}
    on:mousedown={onMouseDown}
    on:keydown={(e) => {
        if (e.key === " " || e.key === "Enter") {
            toggle();
        }
    }}
>
    <!-- svelte-ignore a11y-role-has-required-aria-props -->
    <span
        class="slider-handle {state}"
        role="slider"
        style="left: {dragPercent * 2 + 0.25}rem"
    />
</span>

<style lang="scss">
    .slider {
        position: relative;
        width: 4rem;
        height: 2rem;
        margin-top: 10px;
        margin-bottom: 10px;
        border-radius: 1rem;
        cursor: pointer;
        user-select: none;

        .slider-handle {
            position: absolute;
            top: 0.25rem;
            width: 1.5rem;
            height: 1.5rem;
            border-radius: inherit;
            background-color: #fff;
        }
    }
</style>
