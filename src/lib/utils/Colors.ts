import type { ShapeStates, ShapeState } from "../game/shape";

export const BG_COLOR = "#131516";

export interface PathColor {
    readonly stroke: string;
    readonly fill: string;
}

export interface StateColor {
    readonly normal: string;
    readonly hover: string;
    readonly highlighted: string;
}

export type ShapeColor = {
    [key in ShapeStates]: StateColor;
};

export const shapeColors: ShapeColor = {
    normal: {
        normal: "#52585c",
        hover: "#3f4447",
        highlighted: "#4a5054"
    },
    revealed: {
        normal: "#2d3033",
        hover: "#2d3033",
        highlighted: "#33373a"
    },
    flagged: {
        normal: "#e6e6e6",
        hover: "#d8d8d8",
        highlighted: "#c6c6c6"
    },
    exploded: {
        normal: "#000",
        hover: "#000",
        highlighted: "#111"
    }
}

export type SpecificColors = "default" | "red" | "green" | "blue" | "yellow" | "cyan" | "magenta";

export const specifics: { [key in SpecificColors]: StateColor } = {
    'default': {
        normal: "#e6e6e6",
        highlighted: "#e6e6e6",
        hover: "#e6e6e6",
    },
    'red': {
        normal: "#cc0000",
        highlighted: "#880000",
        hover: "#660000",
    },
    'green': {
        normal: "#10aa00",
        highlighted: "#106600",
        hover: "#104400",
    },
    'blue': {
        normal: "#1000bb",
        highlighted: "#100077",
        hover: "#100055",
    },
    'yellow': {
        normal: "#ccaa00",
        highlighted: "#886600",
        hover: "#664400",
    },
    'cyan': {
        normal: "#10aabb",
        highlighted: "#106677",
        hover: "#104455",
    },
    'magenta': {
        normal: "#cc00bb",
        highlighted: "#880077",
        hover: "#660055",
    },
}

export const strokeColors: SpecificColors[] = Object.keys(specifics) as SpecificColors[];

export function getSpecificColor(name: SpecificColors): StateColor {
    return specifics[name] || specifics['default'];
}

export function getShapeColorByState(state: ShapeState, hovering: boolean): PathColor {
    var color = getSpecificColor(state.color);
    var gs = state.getState();
    return {
        fill: (state.color != 'default' && gs === "normal" ? color : shapeColors[gs])
        [hovering ? 'hover' : state.isHighlighed ? 'highlighted' : 'normal'],
        stroke: color.normal
    };
}

