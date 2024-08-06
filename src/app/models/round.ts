import { Player } from "./player";

export interface Round { 
    roundNumber: number, 
    players: Player[], 
    winner?: Player;
}