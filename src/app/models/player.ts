import { Move } from "./move.enum";

export interface Player {
    name: string, 
    id: number, 
    move?: Move,
    score: number,
}
