import { lineTo, moveTo } from "../game/shape";
import { SingleTile, GrowingFractalPattern, ShrinkingFractalPattern } from "./patterns";

export const square2x2Inward = new GrowingFractalPattern(
    "2x2 Square Inward",
    { x: 2, y: 2 },
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

export const square3x3Inward = new GrowingFractalPattern(
    "3x3 Square Inward",
    { x: 3, y: 3 },
    [
        new SingleTile([
            moveTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, -0.5),
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

export const square4x4Inward = new GrowingFractalPattern(
    "4x4 Square Inward",
    { x: 2, y: 2 },
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
            lineTo(2, 0),
            lineTo(4, 0),
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
            moveTo(0, 2),
            lineTo(-2, 2),
            lineTo(-2, 4),
            lineTo(0, 4),
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
    "* Thick 4x4 Square",
    { x: 3, y: 3 },
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
            moveTo(0, -6),
            lineTo(-2, -6),
            lineTo(-2, -4),
            lineTo(0, -4),
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
            moveTo(0, 6),
            lineTo(-2, 6),
            lineTo(-2, 4),
            lineTo(0, 4),
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
            moveTo(0, 4),
            lineTo(-2, 4),
            lineTo(-2, 2),
            lineTo(0, 2),
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
    [3]
);




export const square2x2Corners = new ShrinkingFractalPattern(
    "* Square 2x2 Corners",
    { x: 2, y: 2 },
    [
        { x: 0.5, y: 0.5 },
        { x: -0.5, y: -0.5 },
    ],
    [
        new SingleTile([
            moveTo(-1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
    ],
    [
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
    ],
)

export const square4x4Corners = new ShrinkingFractalPattern(
    "*Square 4x4 Corners",
    { x: 2, y: 2 },
    [
        { x: 1, y: 1 },
        { x: -1, y: -1 },
    ],
    [
        new SingleTile([
            moveTo(-1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, -2),
            lineTo(0, -2),
            lineTo(0, -1),
            lineTo(-1, -1),
        ]),
        new SingleTile([
            moveTo(-2, -1),
            lineTo(-1, -1),
            lineTo(-1, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(-2, -2),
            lineTo(-1, -2),
            lineTo(-1, -1),
            lineTo(-2, -1),
        ]),

        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, 2),
            lineTo(0, 2),
            lineTo(0, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(2, 1),
            lineTo(1, 1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, 2),
            lineTo(1, 2),
            lineTo(1, 1),
            lineTo(2, 1),
        ]),
    ],
    [
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, -2),
            lineTo(0, -2),
            lineTo(0, -1),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(1, -1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, -2),
            lineTo(1, -2),
            lineTo(1, -1),
            lineTo(2, -1),
        ]),

        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(0, 2),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-2, 1),
            lineTo(-1, 1),
            lineTo(-1, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(-2, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 1),
        ]),
    ],
    [3]
)

export const square2x2CornersAlternating = new ShrinkingFractalPattern(
    "Alternating Square 2x2 Corners",
    { x: 2, y: 2 },
    (_, i) => (i % 2 === 0) ? [
        { x: 0.5, y: 0.5 },
        { x: -0.5, y: -0.5 },
    ] : [
        { x: -0.5, y: 0.5 },
        { x: 0.5, y: -0.5 },
    ],
    [
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
    ],
    (_, i) => (i % 2 === 0) ? [
        new SingleTile([
            moveTo(-1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
    ] : [
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
    ],
)

export const square4x4CornersAlternating = new ShrinkingFractalPattern(
    "* Alternating Square 4x4 Corners",
    { x: 2, y: 2 },
    (_, i) => (i % 2 === 0) ? [
        { x: 1, y: 1 },
        { x: -1, y: -1 },
    ] : [
        { x: -1, y: 1 },
        { x: 1, y: -1 },
    ],
    [
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, -2),
            lineTo(0, -2),
            lineTo(0, -1),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(1, -1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, -2),
            lineTo(1, -2),
            lineTo(1, -1),
            lineTo(2, -1),
        ]),

        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(0, 2),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-2, 1),
            lineTo(-1, 1),
            lineTo(-1, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(-2, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 1),
        ]),
    ],
    (_, i) => (i % 2 === 0) ? [
        new SingleTile([
            moveTo(1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, 2),
            lineTo(0, 2),
            lineTo(0, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(2, 1),
            lineTo(1, 1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, 2),
            lineTo(1, 2),
            lineTo(1, 1),
            lineTo(2, 1),
        ]),

        new SingleTile([
            moveTo(-1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, -2),
            lineTo(0, -2),
            lineTo(0, -1),
            lineTo(-1, -1),
        ]),
        new SingleTile([
            moveTo(-2, -1),
            lineTo(-1, -1),
            lineTo(-1, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(-2, -2),
            lineTo(-1, -2),
            lineTo(-1, -1),
            lineTo(-2, -1),
        ]),
    ] : [
        new SingleTile([
            moveTo(1, -1),
            lineTo(0, -1),
            lineTo(0, 0),
            lineTo(1, 0),
        ]),
        new SingleTile([
            moveTo(1, -2),
            lineTo(0, -2),
            lineTo(0, -1),
            lineTo(1, -1),
        ]),
        new SingleTile([
            moveTo(2, -1),
            lineTo(1, -1),
            lineTo(1, 0),
            lineTo(2, 0),
        ]),
        new SingleTile([
            moveTo(2, -2),
            lineTo(1, -2),
            lineTo(1, -1),
            lineTo(2, -1),
        ]),

        new SingleTile([
            moveTo(-1, 1),
            lineTo(0, 1),
            lineTo(0, 0),
            lineTo(-1, 0),
        ]),
        new SingleTile([
            moveTo(-1, 2),
            lineTo(0, 2),
            lineTo(0, 1),
            lineTo(-1, 1),
        ]),
        new SingleTile([
            moveTo(-2, 1),
            lineTo(-1, 1),
            lineTo(-1, 0),
            lineTo(-2, 0),
        ]),
        new SingleTile([
            moveTo(-2, 2),
            lineTo(-1, 2),
            lineTo(-1, 1),
            lineTo(-2, 1),
        ]),
    ],
    [3]
)

export const square3x3Checkers = new ShrinkingFractalPattern(
    "* Square 3x3 Checkers",
    { x: 3, y: 3 },
    [
        { x: 1, y: 0 },
        { x: 0, y: 1 },
        { x: -1, y: 0 },
        { x: 0, y: -1 },
    ],
    [
        new SingleTile([
            moveTo(-0.5, 1.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, 1.5),
        ]),
        new SingleTile([
            moveTo(1.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, 0.5),
            lineTo(1.5, 0.5),
        ]),
        new SingleTile([
            moveTo(-0.5, -1.5),
            lineTo(-0.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, -1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(-1.5, 0.5),
        ]),
    ],
    [
        new SingleTile([
            moveTo(0.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
        ]),
        new SingleTile([
            moveTo(1.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, 1.5),
            lineTo(1.5, 1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, 0.5),
            lineTo(-0.5, 0.5),
            lineTo(-0.5, 1.5),
            lineTo(-1.5, 1.5),
        ]),
        new SingleTile([
            moveTo(1.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, -1.5),
            lineTo(1.5, -1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, -1.5),
            lineTo(-1.5, -1.5),
        ]),
    ],
    [3]
)

export const square3x3CheckersAltenate = new ShrinkingFractalPattern(
    "* Alternate Square 3x3 Checkers",
    { x: 3, y: 3 },
    [
        { x: 0, y: 0 },
        { x: -1, y: 1 },
        { x: -1, y: -1 },
        { x: 1, y: -1 },
        { x: 1, y: 1 },
    ],
    [
        new SingleTile([
            moveTo(0.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
        ]),
        new SingleTile([
            moveTo(1.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, 1.5),
            lineTo(1.5, 1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, 0.5),
            lineTo(-0.5, 0.5),
            lineTo(-0.5, 1.5),
            lineTo(-1.5, 1.5),
        ]),
        new SingleTile([
            moveTo(1.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, -1.5),
            lineTo(1.5, -1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, -1.5),
            lineTo(-1.5, -1.5),
        ]),
    ],
    [
        new SingleTile([
            moveTo(-0.5, 1.5),
            lineTo(-0.5, 0.5),
            lineTo(0.5, 0.5),
            lineTo(0.5, 1.5),
        ]),
        new SingleTile([
            moveTo(1.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, 0.5),
            lineTo(1.5, 0.5),
        ]),
        new SingleTile([
            moveTo(-0.5, -1.5),
            lineTo(-0.5, -0.5),
            lineTo(0.5, -0.5),
            lineTo(0.5, -1.5),
        ]),
        new SingleTile([
            moveTo(-1.5, -0.5),
            lineTo(-0.5, -0.5),
            lineTo(-0.5, 0.5),
            lineTo(-1.5, 0.5),
        ]),
    ],
    [2]
)





const s3o4 = Math.sqrt(3) / 4;

const l = Math.sqrt(3) / 12;

export const triangleInward = new GrowingFractalPattern(
    "* Triangle Inward",
    { x: 2, y: -2 },
    [
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
        ]),
    ],
    [
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(-1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(0, l - s3o4 * 3),
        ]),
    ],
    [20]
);

export const triangle3Inward = new GrowingFractalPattern(
    "* 3 Triangles Inward",
    { x: 2, y: -2 },
    [
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(-1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(0, l - s3o4 * 3),
        ]),
    ],
    [
        new SingleTile([
            moveTo(1, l - s3o4 * 3),
            lineTo(0.5, l - s3o4),
            lineTo(1.5, l - s3o4),
        ]),
        new SingleTile([
            moveTo(1, l - s3o4 * 3),
            lineTo(0.5, l - s3o4),
            lineTo(0.0, l - s3o4 * 3),
        ]),
        new SingleTile([
            moveTo(1, l - s3o4 * 3),
            lineTo(1.5, l - s3o4),
            lineTo(2.0, l - s3o4 * 3),
        ]),
        new SingleTile([
            moveTo(0.5, l - s3o4),
            lineTo(1.5, l - s3o4),
            lineTo(1.0, l + s3o4),
        ]),

        new SingleTile([
            moveTo(-1, l - s3o4 * 3),
            lineTo(-0.5, l - s3o4),
            lineTo(-1.5, l - s3o4),
        ]),
        new SingleTile([
            moveTo(-1, l - s3o4 * 3),
            lineTo(-0.5, l - s3o4),
            lineTo(-0.0, l - s3o4 * 3),
        ]),
        new SingleTile([
            moveTo(-1, l - s3o4 * 3),
            lineTo(-1.5, l - s3o4),
            lineTo(-2.0, l - s3o4 * 3),
        ]),
        new SingleTile([
            moveTo(-0.5, l - s3o4),
            lineTo(-1.5, l - s3o4),
            lineTo(-1.0, l + s3o4),
        ]),

        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(0.5, l + s3o4 * 3),
            lineTo(-0.5, l + s3o4 * 3),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(0.5, l + s3o4 * 3),
            lineTo(1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l + s3o4 * 3),
            lineTo(-1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(0.5, l + s3o4 * 3),
            lineTo(-0.5, l + s3o4 * 3),
            lineTo(0.0, l + s3o4 * 5),
        ]),
    ],
    [6]
);

export const triangleOutward = new ShrinkingFractalPattern(
    "* Triangle Outward",
    { x: 2, y: 2 },
    [
        { x: 0, y: -l - s3o4 },
        { x: 0.5, y: s3o4 - l },
        { x: -0.5, y: s3o4 - l },
    ],
    [
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(-1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(1.0, l + s3o4),
        ]),
        new SingleTile([
            moveTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
            lineTo(0, l - s3o4 * 3),
        ]),
    ],
    [
        new SingleTile([
            moveTo(0, l + s3o4),
            lineTo(-0.5, l - s3o4),
            lineTo(0.5, l - s3o4),
        ]),
    ],
    [4]
);