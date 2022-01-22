import type { Grid } from "../game/grid";
import type { Pattern } from "../patterns/patterns";

// Unsure, probably not needed
export type GameEvents =
    | 'game-start'   // Starts new game
    | 'game-pause'   // Pauses game (pauses timer)
    | 'game-resume'  // Resumes game (resumes timer)
    | 'game-restart' // Restarts game (resets timer)
    | 'game-new-game' // Recreates game with same settings (resets timer)
    | 'game-win'     // Game is won (stops timer)
    | 'game-lose'    // Game is lost (stops timer)

export type MainMenuEvents =
    | 'main-menu-change'   // When changing menu
    | 'main-menu-new-game' // Generates new game

export type PauseMenuEvents =
    | 'pause-menu-open'   // When opening pause menu
    | 'pause-menu-change' // When changing menu (options, etc)
    | 'pause-menu-exit'   // When exiting pause menu (either resume game or exit to main menu)

export interface GameEvent {
    type: GameEvents;
}

export interface GameStartOptions extends GameEvent {
    grid: Grid;
}

export interface GamePauseOptions extends GameEvent {
    timer: number;
}

export interface GameResumeOptions extends GameEvent {
    timer: number;
}

export interface GameWinOptions extends GameEvent {
    timer: number;
}

export interface MainMenuEvent {
    type: MainMenuEvents;
}

export interface MainMenuChangeOptions extends MainMenuEvent {
    type: 'main-menu-change';
    menu: string;
}

export interface MainMenuNewGameOptions extends MainMenuEvent { // Todo: add colour stuffs
    type: 'main-menu-new-game';
    grid: Grid;
    pattern: Pattern<any>;
    patternSize: { [key: string]: any }; // Pattern type speific
    mineCount: number;
    minePercent: boolean;
    difficulty?: number; // I have no idea how to implement this
}

export interface PauseMenuEvent {
    type: PauseMenuEvents;
}

export interface PauseMenuChangeOptions extends PauseMenuEvent {
    menu: string;
}