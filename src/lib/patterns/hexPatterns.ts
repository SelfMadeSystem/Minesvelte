import { lineTo, moveTo } from "../game/shape";
import { SingleTile, HexPattern } from "./patterns";

export const hex = new HexPattern(
    "* Hex",
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

export const triangle = new HexPattern(
    "* Triangle",
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
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(1, 0),
            lineTo(0, 0),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(2, -1),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(2, 0),
            lineTo(1, 0),
        ]),
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const square = new HexPattern(
    "Square",
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1)
        ]),
    ],
)

export const tetrille1 = new HexPattern(
    "* Tetrille 1 / Lozenges",
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
    ],
    (p) => p,
    [false, 4, 4, 4]
)

export const tetrille2 = new HexPattern(
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
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const tetrille3 = new HexPattern(
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
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const complex1 = new HexPattern(
    "*  Complex 1",
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
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const hexSurroundedByTriangles = new HexPattern(
    "* Hex Surrounded by Triangles",
    { x: 3, y: 1 },
    { x: 2, y: -2 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(1, 0),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, 1),
            lineTo(1, 1),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, 1),
            lineTo(1, 1),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 3),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 3),
            lineTo(0, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(-2, 3),
            lineTo(-1, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(-2, 3),
            lineTo(-1, 2),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(-2, 1),
            lineTo(-1, 1),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(-2, 1),
            lineTo(-1, 1),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(0, 0),
            lineTo(1, -1),
        ]),
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const hexStarGap = new HexPattern(
    "* Hex Star Gap",
    { x: 4, y: 2 },
    { x: 2, y: -2 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
    ],
    (p) => p,
    [false, 3, 3, 3]
)

export const hexStarTesselation = new HexPattern(
    "* Hex Star Tesselation",
    { x: 2, y: 2 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 2),
            lineTo(-1, 2),
            lineTo(-1, 3),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
    ],
    (p) => p,
    [false, 3, 3, 3]
)

const s3o2 = Math.sqrt(3) / 2;

export const rhombitrihexagonal = new HexPattern(
    "* Rhombitrihexagonal",
    { x: 1 + s3o2 * 2, y: 1.5 + s3o2 },
    { x: 0.5 + s3o2, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 0),
            lineTo(0.5, -s3o2),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(0.5, -s3o2),
            lineTo(0.5 + s3o2, -0.5 - s3o2),
            lineTo(1 + s3o2, -0.5),
        ]),
        new SingleTile([
            moveTo(1 + s3o2, -0.5),
            lineTo(0.5 + s3o2, -0.5 - s3o2),
            lineTo(1.5 + s3o2, -0.5 - s3o2),
        ]),
        new SingleTile([
            moveTo(1 + 2 * s3o2, 0),
            lineTo(1.5 + 2 * s3o2, -s3o2),
            lineTo(1.5 + s3o2, -0.5 - s3o2),
            lineTo(1 + s3o2, -0.5),
        ]),

        new SingleTile([
            moveTo(0.5, 1 + s3o2),
            lineTo(0, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(0.5 + s3o2, 1.5 + s3o2),
            lineTo(1 + s3o2, 1.5),
            lineTo(1.5 + s3o2, 1.5 + s3o2),
        ]),

        new SingleTile([
            moveTo(0.5 + s3o2, 1.5 + s3o2),
            lineTo(1 + s3o2, 1.5),
            lineTo(1, 1),
            lineTo(0.5, 1 + s3o2),
        ]),
        new SingleTile([
            moveTo(1.5 + s3o2, 1.5 + s3o2),
            lineTo(1 + s3o2, 1.5),
            lineTo(1 + 2 * s3o2, 1),
            lineTo(1.5 + 2 * s3o2, 1 + s3o2),
        ]),
        new SingleTile([
            moveTo(1 + 2 * s3o2, 0),
            lineTo(2 + 2 * s3o2, 0),
            lineTo(2 + 2 * s3o2, 1),
            lineTo(1 + 2 * s3o2, 1),
        ]),
        new SingleTile([
            moveTo(1 + 2 * s3o2, 0),
            lineTo(1.5 + 2 * s3o2, -s3o2),
            lineTo(2 + 2 * s3o2, 0),
        ]),
        new SingleTile([
            moveTo(1.5 + 2 * s3o2, 1 + s3o2),
            lineTo(1 + 2 * s3o2, 1),
            lineTo(2 + 2 * s3o2, 1),
        ]),

        new SingleTile([
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(1 + s3o2, 1.5),
            lineTo(1 + 2 * s3o2, 1),
            lineTo(1 + 2 * s3o2, 0),
            lineTo(1 + s3o2, -0.5),
        ]),
    ],
    (p) => p,
    [false, 3, 3, 3],
    false
)
