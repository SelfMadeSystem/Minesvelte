export class ShapeColor {
    constructor(
        public readonly stroke: string,
        public readonly fill: string,
    ) {
    }
}

export class MineColor {
    constructor(
        public readonly normal: ShapeColor,
        public readonly hover: ShapeColor,
        public readonly flagged: ShapeColor,
        public readonly exploded: ShapeColor,
        public readonly revealed: ShapeColor,
    ) {
    }
}

export const colors: { [key: string]: MineColor } = {
    'default': new MineColor(
        new ShapeColor('#c8c3bc', '#52585c'),
        new ShapeColor('#c8c3bc', '#52585c'),
        new ShapeColor('#800', '#300'),
        new ShapeColor('#800', '#300'),
        new ShapeColor('#c8c3bc', '#313538'),
    ),
}

export function getMineColor(name: string): MineColor {
    return colors[name] || colors['default'];
}

export function getShapeColor(mineColor: MineColor, state: string): ShapeColor {
    switch (state) {
        case 'normal':
            return mineColor.normal;
        case 'hover':
            return mineColor.hover;
        case 'flagged':
            return mineColor.flagged;
        case 'exploded':
            return mineColor.exploded;
        case 'revealed':
            return mineColor.revealed;
        default:
            throw new Error(`Unknown state: ${state}`);
    }
}

export function getShapeColorByState(name: string, state: string): ShapeColor {
    return getShapeColor(getMineColor(name), state);
}
