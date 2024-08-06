import { Player } from "./player";
import { Round } from "./round";

export interface Game {
    id: number, 
    rounds: Round[],
    overallWinner?: Player;
}

export type ResetState = 'DATA' |  'TEMPLATE_AND_DATA' | undefined; 

export interface GameLog { 
    gameFinished: boolean; 
    gameWinner?: Player; 
    gameRounds?: Round[];
    // this is where you would want to log each play to save.
}