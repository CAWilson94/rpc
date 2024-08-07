import { Move } from "./move.enum";

export type PlayerType = 'COMPUTER' |  'HUMAN' | undefined; 

export interface Player {
    name: string, 
    id: number, 
    move?: Move,
    score: number,
    isComputer: boolean,
}
