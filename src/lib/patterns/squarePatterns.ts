import { lineTo, moveTo } from "../game/shape";
import { SingleTile, SquarePattern } from "./patterns";

export const basic = new SquarePattern(
    "* Basic",
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ])
    ],
    [],
    [],
    [],
    [],
    [15, 15],
);

export const squareTriangles = new SquarePattern(
    "* Square Triangles",
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    ({ x, y }) => [
        new SingleTile([
            ...((y) % 2 > 0 ? [
                moveTo(0, 0),
                lineTo(1, 0),
                lineTo(1, 1),
            ] : [
                moveTo(0, 0),
                lineTo(1, 0),
                lineTo(0, 1),
            ])
        ]),
        new SingleTile([
            ...((y) % 2 > 0 ? [
                moveTo(0, 0),
                lineTo(0, 1),
                lineTo(1, 1),
            ] : [
                moveTo(1, 0),
                lineTo(1, 1),
                lineTo(0, 1),
            ])
        ]),
    ],
    [],
    [],
    [],
    [],
    [7, 7],
);

export const tessellations1 = new SquarePattern(
    "* Tessellations 1",
    { x: 3, y: 3 },
    { x: 0, y: 0 },
    ({ x, y }) => [
        ...(x === 0 || y === 0 ? [] : [
            new SingleTile([
                moveTo(1, 0),
                lineTo(2, 1),
                lineTo(1, 2),
                lineTo(0, 1),
            ]),
        ]),
        ...((x + y) % 2 ?
            [
                new SingleTile([
                    moveTo(2, 1),
                    lineTo(1, 2),
                    lineTo(1, 3),
                    lineTo(2, 4),
                ]),
                new SingleTile([
                    moveTo(3, 1),
                    lineTo(4, 2),
                    lineTo(4, 3),
                    lineTo(3, 4),
                ]),
                new SingleTile([
                    moveTo(2, 1),
                    lineTo(2, 4),
                    lineTo(3, 4),
                    lineTo(3, 1),
                ]),
            ]
            :
            [
                new SingleTile([
                    moveTo(1, 2),
                    lineTo(2, 1),
                    lineTo(3, 1),
                    lineTo(4, 2),
                ]),
                new SingleTile([
                    moveTo(1, 3),
                    lineTo(2, 4),
                    lineTo(3, 4),
                    lineTo(4, 3),
                ]),
                new SingleTile([
                    moveTo(1, 2),
                    lineTo(4, 2),
                    lineTo(4, 3),
                    lineTo(1, 3),
                ]),
            ]
        ),
    ],
);

const s3o2 = Math.sqrt(3) / 2;

export const squaresAndTriangles = new SquarePattern(
    "* Squares and Triangles",
    { x: 1, y: 1 + s3o2 },
    ({ y }) => ({ x: y % 2 * 0.5, y: 0 }),
    ({ y }) => [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ]),
        new SingleTile([
            moveTo(0, 1),
            lineTo(0.5, 1 + s3o2),
            lineTo(1, 1),
        ]),
        ...(y % 2 ? [
            new SingleTile([
                moveTo(0, 1),
                lineTo(0.5, 1 + s3o2),
                lineTo(-0.5, 1 + s3o2),
            ]),] : [
            new SingleTile([
                moveTo(1, 1),
                lineTo(0.5, 1 + s3o2),
                lineTo(1.5, 1 + s3o2),
            ]),
        ]),
    ]
);

export const rhombitrihexagonal = new SquarePattern(
    "* Rhombitrihexagonal",
    { x: 1 + 2 * s3o2, y: 1.5 + s3o2 },
    ({ y }) => ({ x: y % 2 * (-0.5 - s3o2), y: 0 }),
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
            moveTo(1, 0),
            lineTo(1, 1),
            lineTo(1 + s3o2, 1.5),
            lineTo(1 + 2 * s3o2, 1),
            lineTo(1 + 2 * s3o2, 0),
            lineTo(1 + s3o2, -0.5),
        ]),
    ],
    [],
    [
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
    ],
    ({ y }, { y: my }) => [
        ...(y % 2 && y !== my - 1 ? [new SingleTile([
            moveTo(0.5, 1 + s3o2),
            lineTo(0, 1),
            lineTo(1, 1),
        ]),
        new SingleTile([
            moveTo(0.5 + s3o2, 1.5 + s3o2),
            lineTo(1 + s3o2, 1.5),
            lineTo(1, 1),
            lineTo(0.5, 1 + s3o2),
        ]),] : []),
    ],
    ({ y }, { y: my }) => [
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
        ...(!(y % 2) || y == my - 1 ? [
            new SingleTile([
                moveTo(1.5 + 2 * s3o2, 1 + s3o2),
                lineTo(1 + 2 * s3o2, 1),
                lineTo(2 + 2 * s3o2, 1),
            ]),
        ] : []),
        ...(!(y % 2) && y != my - 1 ? [new SingleTile([
            moveTo(1.5 + s3o2, 1.5 + s3o2),
            lineTo(1 + s3o2, 1.5),
            lineTo(1 + 2 * s3o2, 1),
            lineTo(1.5 + 2 * s3o2, 1 + s3o2),
        ]),] : []),
    ],
    [4, 4],
);
// (1 + 2 * s3o2)/2 = 0.5 + s3o2