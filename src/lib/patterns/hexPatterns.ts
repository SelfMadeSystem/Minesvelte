import { lineTo, moveTo } from "../game/shape";
import { SingleTile, SquarePattern } from "./patterns";

export const hex = new SquarePattern(
    "Hex",
    { x: 2, y: 1 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
        ])
    ]
)

export const triangle = new SquarePattern(
    "Triangle",
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ]),
    ]
)

export const lozenges = new SquarePattern(
    "Lozenges",
    { x: 2, y: 1 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, -1),
            lineTo(-1, 0),
            lineTo(-1, 1),
        ]),
    ]
)

export const tetrille1 = new SquarePattern(
    "Tetrille 1",
    { x: 2, y: 1 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, -1),
            lineTo(-1, 0),
            lineTo(-1, 1),
        ]),
    ]
)

export const tetrille2 = new SquarePattern(
    "Tetrille 2",
    { x: 5, y: 4 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(2, 0),
            lineTo(3, -1),
            lineTo(3, -2),
            lineTo(2, -2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(2, 0),
            lineTo(2, 1),
            lineTo(1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, 2),
            lineTo(-1, 3),
            lineTo(-2, 3),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, 2),
            lineTo(-3, 2),
            lineTo(-3, 1),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, 0),
            lineTo(-2, -1),
            lineTo(-1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, -2),
            lineTo(1, -3),
            lineTo(2, -3),
            lineTo(2, -2),
        ]),
    ]
)

export const tetrille3 = new SquarePattern(
    "Tetrille 3",
    { x: 5, y: 4 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(3, -2),
            lineTo(2, -2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(3, -2),
            lineTo(3, -1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(3, -1),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(2, 0),
            lineTo(2, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(2, 1),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, 3),
            lineTo(-2, 3),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, 3),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, 2),
            lineTo(-3, 2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-3, 2),
            lineTo(-3, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-3, 1),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, 0),
            lineTo(-2, -1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-2, -1),
            lineTo(-1, -2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, -2),
            lineTo(1, -3),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, -3),
            lineTo(2, -3),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(2, -3),
            lineTo(2, -2),
        ]),
    ]
)

export const complex1 = new SquarePattern(
    "Complex 1",
    { x: 4, y: 2 },
    { x: 2, y: -2 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0, -1),
            lineTo(-1, 0),
            lineTo(-1, 1),
        ]),

        new SingleTile([
            moveTo(1, 0),
            lineTo(0, 1),
            lineTo(0, 2),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, -2),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(2, -2),
            lineTo(0, -2),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(0, -2),
            lineTo(-2, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 0),
            lineTo(-2, 0),
            lineTo(-2, 2),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(-2, 2),
            lineTo(0, 2),
            lineTo(0, 1),
        ]),
    ]
)