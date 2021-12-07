import { lineTo, moveTo } from "../game/shape";
import { SingleTile, SquarePattern } from "./patterns";

export const basic = new SquarePattern(
    { x: 1, y: 1 },
    { x: 0, y: 0 },
    [
        new SingleTile([
            moveTo(0, 0),
            lineTo(1, 0),
            lineTo(1, 1),
            lineTo(0, 1),
        ])
    ]
);

export const cross = new SquarePattern(
    { x: 2, y: 2 },
    { x: 1, y: -1 },
    [
        new SingleTile([
            moveTo(1, 1),
            lineTo(2, 1),
            lineTo(2, 2),
            lineTo(3, 2),
            lineTo(3, 3),
            lineTo(2, 3),
            lineTo(2, 4),
            lineTo(1, 4),
            lineTo(1, 3),
            lineTo(0, 3),
            lineTo(0, 2),
            lineTo(1, 2),
        ]),
    ],
);

export const tessellations1 = new SquarePattern(
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
