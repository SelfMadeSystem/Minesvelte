# Minesvelte

[Tametsi](http://www.griptopgames.com) clone made in svelte.

**It's not production ready.**

## How to play now doe???

### Get source code
Do the command (if you have git) `git clone https://github.com/True-cc/Minesvelte.git` to clone onto your machine (if you have git) or click `Code` and `Download ZIP`

### Get yarn
Get yarn onto your machine: https://yarnpkg.com/getting-started

### Get dependencies
Do the command `yarn` to download dependencies

### Run development version
DO the command `yarn dev` to run the development version. You should be able to connect to it at http://localhost:3000 in a web browser.

## But I want more mapsss!!1!!!!11!

Go in `/src/lib/components/Game.svelte` and you should see this
```ts
/* import stuff */

var grid = new SquareGrid();

/* code stuff */

// grid.generateDefaultGrid(5);
squarePatterns.squareTriangleAndHexagon.generateGrid(grid, { x: 7, y: 7 });
grid.resetShapes();
minesLeft = grid.setMineRatio(0.15);
grid.centerOnScreen();
```

You can change the `SquareGrid` to a `HexGrid` if you want and you can find a list of patterns in `/src/lib/patterns/` (in `hexPatterns.ts` and `squarePatterns.ts`). Please use your brain to figure out how to do this; this isn't a coding tutorial.
