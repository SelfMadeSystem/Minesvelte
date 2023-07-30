import { lineTo, moveTo } from "../game/shape";
import { SingleTile, GrowingFractalPattern } from "./patterns";

export const square2x2 = new GrowingFractalPattern(
    "2x2 Square",
    2,
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ])
    ],
    [
        new SingleTile([
            moveTo(1, 1),
            lineTo(2, 1),
            lineTo(2, 2),
            lineTo(1, 2),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(1, 1),
            lineTo(1, 2),
            lineTo(0, 2),
        ]),

        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, 1),
            lineTo(1, 1),
        ]),
    ],
);

export const square3x3 = new GrowingFractalPattern(
    "3x3 Square",
    3,
    [
        new SingleTile([
            moveTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5,  0.5),
            lineTo(0.5,  -0.5),
        ])
    ],
    [
        new SingleTile([
            moveTo(-1.5, -1.5),
            lineTo(-1.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, -1.5),
        ]),
        new SingleTile([
            moveTo(-0.5, -1.5),
            lineTo(-0.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, -1.5),
        ]),
        new SingleTile([
            moveTo(0.5, -1.5),
            lineTo(0.5, -0.5),
            lineTo(1.5, -0.5),
            lineTo(1.5, -1.5),
        ]),

        new SingleTile([
            moveTo(-1.5, -0.5),
            lineTo(-1.5, 0.5),
            lineTo(-0.5, 0.5),
            lineTo(-0.5, -0.5),
        ]),
        new SingleTile([
            moveTo(0.5, -0.5),
            lineTo(0.5, 0.5),
            lineTo(1.5, 0.5),
            lineTo(1.5, -0.5),
        ]),

        new SingleTile([
            moveTo(-1.5, 1.5),
            lineTo(-1.5, 0.5),
            lineTo(-0.5, 0.5),
            lineTo(-0.5, 1.5),
        ]),
        new SingleTile([
            moveTo(-0.5, 1.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, 1.5),
        ]),
        new SingleTile([
            moveTo(0.5, 1.5),
            lineTo(0.5, 0.5),
            lineTo(1.5, 0.5),
            lineTo(1.5, 1.5),
        ]),
    ],
);

export const square4x4 = new GrowingFractalPattern(
    "4x4 Square",
    2,
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(1, 1),
            lineTo(1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(2, 1),
            lineTo(2, 2),
            lineTo(1, 2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, 0),
            lineTo(-1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(-1, 1),
            lineTo(-1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(-1, 0),
            lineTo(-2, 0),
            lineTo(-2, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(-2, 1),
            lineTo(-2, 2),
            lineTo(-1, 2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, 0),
            lineTo(-1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(-1, -1),
            lineTo(-1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(-1, 0),
            lineTo(-2, 0),
            lineTo(-2, -1),
            lineTo(-1, -1),
        ]),
        new SingleTile([
            moveTo(-1, -1),
            lineTo(-2, -1),
            lineTo(-2, -2),
            lineTo(-1, -2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(1, -1),
            lineTo(1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, -1),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(2, -1),
            lineTo(2, -2),
            lineTo(1, -2),
        ]),
    ],
    [
        new SingleTile([
            moveTo(-2, -4),
            lineTo(-4, -4),
            lineTo(-4, -2),
            lineTo(-2, -2),
        ]),
        new SingleTile([
            moveTo(0, -4),
            lineTo(-2, -4),
            lineTo(-2, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(2, -4),
            lineTo(0, -4),
            lineTo(0, -2),
            lineTo(2, -2),
        ]),
        new SingleTile([
            moveTo(4, -4),
            lineTo(2, -4),
            lineTo(2, -2),
            lineTo(4, -2),
        ]),

        new SingleTile([
            moveTo(-2, -2),
            lineTo(-4, -2),
            lineTo(-4, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(4, -2),
            lineTo(2, -2),
            lineTo(2,  0),
            lineTo(4,  0),
        ]),

        new SingleTile([
            moveTo(-2, 0),
            lineTo(-4, 0),
            lineTo(-4, 2),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(4, 0),
            lineTo(2, 0),
            lineTo(2, 2),
            lineTo(4, 2),
        ]),

        new SingleTile([
            moveTo(-2, 2),
            lineTo(-4, 2),
            lineTo(-4, 4),
            lineTo(-2, 4),
        ]),
        new SingleTile([
            moveTo(0,  2),
            lineTo(-2, 2),
            lineTo(-2, 4),
            lineTo(0,  4),
        ]),
        new SingleTile([
            moveTo(2, 2),
            lineTo(0, 2),
            lineTo(0, 4),
            lineTo(2, 4),
        ]),
        new SingleTile([
            moveTo(4, 2),
            lineTo(2, 2),
            lineTo(2, 4),
            lineTo(4, 4),
        ]),
    ],
);

function genThiccSquare4x4(dy: number) {
    return [
        new SingleTile([
            moveTo(-4, -6 + dy),
            lineTo(-6, -6 + dy),
            lineTo(-6, -4 + dy),
            lineTo(-4, -4 + dy),
        ]),
        new SingleTile([
            moveTo(-2, -6 + dy),
            lineTo(-4, -6 + dy),
            lineTo(-4, -4 + dy),
            lineTo(-2, -4 + dy),
        ]),
        new SingleTile([
            moveTo(4, -6 + dy),
            lineTo(2, -6 + dy),
            lineTo(2, -4 + dy),
            lineTo(4, -4 + dy),
        ]),
        new SingleTile([
            moveTo(6, -6 + dy),
            lineTo(4, -6 + dy),
            lineTo(4, -4 + dy),
            lineTo(6, -4 + dy),
        ])
    ]
}

export const square4x4thicc = new GrowingFractalPattern(
    "Thick 4x4 Square",
    3,
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(1, 1),
            lineTo(1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(2, 1),
            lineTo(2, 2),
            lineTo(1, 2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, 0),
            lineTo(-1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(-1, 1),
            lineTo(-1, 2),
            lineTo(0, 2),
        ]),
        new SingleTile([
            moveTo(-1, 0),
            lineTo(-2, 0),
            lineTo(-2, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(-2, 1),
            lineTo(-2, 2),
            lineTo(-1, 2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(-1, 0),
            lineTo(-1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(-1, -1),
            lineTo(-1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(-1, 0),
            lineTo(-2, 0),
            lineTo(-2, -1),
            lineTo(-1, -1),
        ]),
        new SingleTile([
            moveTo(-1, -1),
            lineTo(-2, -1),
            lineTo(-2, -2),
            lineTo(-1, -2),
        ]),

        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, -1),
            lineTo(0, -1),
        ]),
        new SingleTile([
            moveTo(0, -1),
            lineTo(1, -1),
            lineTo(1, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(1, 0),
            lineTo(2, 0),
            lineTo(2, -1),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(2, -1),
            lineTo(2, -2),
            lineTo(1, -2),
        ]),
    ],
    [
        new SingleTile([
            moveTo(-4, -6),
            lineTo(-6, -6),
            lineTo(-6, -4),
            lineTo(-4, -4),
        ]),
        new SingleTile([
            moveTo(-2, -6),
            lineTo(-4, -6),
            lineTo(-4, -4),
            lineTo(-2, -4),
        ]),
        new SingleTile([
            moveTo(0,  -6),
            lineTo(-2, -6),
            lineTo(-2, -4),
            lineTo(0,  -4),
        ]),
        new SingleTile([
            moveTo(2, -6),
            lineTo(0, -6),
            lineTo(0, -4),
            lineTo(2, -4),
        ]),
        new SingleTile([
            moveTo(4, -6),
            lineTo(2, -6),
            lineTo(2, -4),
            lineTo(4, -4),
        ]),
        new SingleTile([
            moveTo(6, -6),
            lineTo(4, -6),
            lineTo(4, -4),
            lineTo(6, -4),
        ]),

        new SingleTile([
            moveTo(-4, -4),
            lineTo(-6, -4),
            lineTo(-6, -2),
            lineTo(-4, -2),
        ]),
        new SingleTile([
            moveTo(-2, -4),
            lineTo(-4, -4),
            lineTo(-4, -2),
            lineTo(-2, -2),
        ]),
        new SingleTile([
            moveTo(0, -4),
            lineTo(-2, -4),
            lineTo(-2, -2),
            lineTo(0, -2),
        ]),
        new SingleTile([
            moveTo(2, -4),
            lineTo(0, -4),
            lineTo(0, -2),
            lineTo(2, -2),
        ]),
        new SingleTile([
            moveTo(4, -4),
            lineTo(2, -4),
            lineTo(2, -2),
            lineTo(4, -2),
        ]),
        new SingleTile([
            moveTo(6, -4),
            lineTo(4, -4),
            lineTo(4, -2),
            lineTo(6, -2),
        ]),

        ...genThiccSquare4x4(4),

        ...genThiccSquare4x4(6),

        new SingleTile([
            moveTo(-4, 6),
            lineTo(-6, 6),
            lineTo(-6, 4),
            lineTo(-4, 4),
        ]),
        new SingleTile([
            moveTo(-2, 6),
            lineTo(-4, 6),
            lineTo(-4, 4),
            lineTo(-2, 4),
        ]),
        new SingleTile([
            moveTo(0,  6),
            lineTo(-2, 6),
            lineTo(-2, 4),
            lineTo(0,  4),
        ]),
        new SingleTile([
            moveTo(2, 6),
            lineTo(0, 6),
            lineTo(0, 4),
            lineTo(2, 4),
        ]),
        new SingleTile([
            moveTo(4, 6),
            lineTo(2, 6),
            lineTo(2, 4),
            lineTo(4, 4),
        ]),
        new SingleTile([
            moveTo(6, 6),
            lineTo(4, 6),
            lineTo(4, 4),
            lineTo(6, 4),
        ]),

        new SingleTile([
            moveTo(-4, 4),
            lineTo(-6, 4),
            lineTo(-6, 2),
            lineTo(-4, 2),
        ]),
        new SingleTile([
            moveTo(-2, 4),
            lineTo(-4, 4),
            lineTo(-4, 2),
            lineTo(-2, 2),
        ]),
        new SingleTile([
            moveTo(0,  4),
            lineTo(-2, 4),
            lineTo(-2, 2),
            lineTo(0,  2),
        ]),
        new SingleTile([
            moveTo(2, 4),
            lineTo(0, 4),
            lineTo(0, 2),
            lineTo(2, 2),
        ]),
        new SingleTile([
            moveTo(4, 4),
            lineTo(2, 4),
            lineTo(2, 2),
            lineTo(4, 2),
        ]),
        new SingleTile([
            moveTo(6, 4),
            lineTo(4, 4),
            lineTo(4, 2),
            lineTo(6, 2),
        ]),
    ],
);
