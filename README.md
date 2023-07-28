# Minesvelte

[Tametsi](http://www.griptopgames.com) remake made in Svelte.

**It's not production ready.**

## Getting started

### Get source code
If you have `git` installed, do `git clone https://github.com/True-cc/Minesvelte.git` to clone this respository onto your machine.
If you do not have `git` installed, you may simply click `Code`, `Download ZIP`, and then extract the zip file somewhere.

### Get yarn
This project uses yarn as its package manager. Install steps are located here: https://yarnpkg.com/getting-started

### Get dependencies
Do the command `yarn` in a terminal to download the dependencies

### Run development version
Do the command `yarn dev` to run the development version. You should be able to connect to it at http://localhost:5173 in a web browser.

## Playing

### New game

You can click the "New Game" button to create a new game. You can then customize the game to fit your needs.

### Controls

#### Basics

Scroll to zoom. Left-click on tiles to reveal them. Right-click to flag them as mines. If a revealed tile has the number of flags around it equal to its number, you can click it to automatically reveal the remaining tiles.

Press "U" to undo. Press "R" to redo.

You can hold down the control key to highlight the tiles considered to be adjacent to the tile the mouse is hovering over. This can be useful as it is not always obvious which tiles are considered adjacent, especially with more complex patterns.

#### Pause menu

Press the escape key to pause the game.

In the pause menu, you can click "New Game" to create a new game with the same settings as the current game. The only other buttons that work are "Resume" and "Exit".

#### Solver

In the top right, you can press the "Solve" button to solve the game. This will reveal all the mines and flags.

You can also press the "Make Solvable" button to make the game solvable (if it is not already). This works by running the solver algorithm and then randomly revealing tiles until the game is solvable. I will make this automatic in the future (along with other features like color, mine lines, actually using logic and not randomness to reveal tiles, etc).

## Unimplemented

Right now, these things exist in the code, but there is no way to access them or customize them:
- Mine lines (?). Basically, a line with a number that tells you how many mines are in that line.
- Colors. Different tiles can have different colors. In the top-right, you will see a number for each color. This number tells you how many unrevealed and unflagged tiles of that color are mines.

These things exist in the UI, but do not do anything:
- Loading/saving games
- Options

These things are hinted at somewhere in the code, but do not actually exist:
- Difficulty levels - a comment used to say "I have no idea how to implement this", but after some thought, I think I just need to change the solver algorithm to be more general.

I would like to implement these features if I have time, but I don't know when that will be (if ever):
- Mobile/touch support
- Customizable graphics
- Not use SVG because it's slow (this will require a lot of work)
- Better board generation with automatic make-solvable
