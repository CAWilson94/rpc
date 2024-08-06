import { Player } from "./player";
import { Round } from "./round";

export interface Game {
    id: number, 
    rounds: Round[],
    overallWinner?: Player;
}

export type ResetState = 'DATA' |  'TEMPLATE_AND_DATA' | undefined; 