import { Player } from "./player";
import { Round } from "./round";

export interface Game {
    id: number, 
    rounds: Round[],
    overallWinner?: Player;
}

/**
 * Probably the winners and scores should be part of the game so we can 
 * have a thing like a score board etc. Lets see how this pans out. 
 * 
 * Maybe we can have a round interface to represent the round of a game 
 */