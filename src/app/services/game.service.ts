import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Player } from '../models/player';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  private playerInputSubject = new BehaviorSubject<string>('');
  private errorMessageSubject = new BehaviorSubject<string>('');

  private playersSubject: BehaviorSubject<Player[]> = new BehaviorSubject<
    Player[]
  >([]);

  playerInput$ = this.playerInputSubject.asObservable();
  errorMessage$ = this.errorMessageSubject.asObservable();
  players$: Observable<Player[]> = this.playersSubject.asObservable();

  private readonly MAX_PLAYERS = 2;
  private nextPlayerId = 0;

  constructor() {}

  notifyPlayerInput(input: string) {
    this.playerInputSubject.next(input);
  }

  notifyErrorMessage(message: string) {
    this.errorMessageSubject.next(message);
  }

  clearErrorMessage() {
    this.errorMessageSubject.next('');
  }

  addPlayer(playerName: string) {
    const currentPlayers: Player[] = this.playersSubject.getValue();
    if (currentPlayers.length >= this.MAX_PLAYERS) {
      console.warn(`Cannot add more than ${this.MAX_PLAYERS}`);
      return;
    }
    const newPlayer: Player = { name: playerName, id: this.nextPlayerId++}; // will end up skipping the 0th id I think
    const updatedPlayers = [...this.playersSubject.getValue(), newPlayer];
    this.playersSubject.next(updatedPlayers);
  }
}