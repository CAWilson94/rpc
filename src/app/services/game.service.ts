import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, timeInterval } from 'rxjs';
import { Player } from '../models/player';
import { ResetState } from '../models/game';

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

  readonly MAX_PLAYERS = 2;
  private nextPlayerId = 0;

  private gameResetSubject = new BehaviorSubject<ResetState>(undefined);
  gameReset$ = this.gameResetSubject.asObservable();

  private gameFinishSubject = new BehaviorSubject<boolean>(false);
  gameFinish$ = this.gameFinishSubject.asObservable();

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
    const newPlayer: Player = {
      name: playerName,
      id: this.nextPlayerId++,
      score: 0,
    }; // will end up skipping the 0th id I think
    const updatedPlayers = [...this.playersSubject.getValue(), newPlayer];
    this.playersSubject.next(updatedPlayers);
  }

  resetRound(resetTemplating: boolean) {
    this.players$ = this.players$.pipe(
      map((players) => players.map(({ move, ...rest }) => rest))
    );
    this.gameResetSubject.next(resetTemplating ? 'TEMPLATE_AND_DATA' : 'DATA');
  }

  finishGames() {
    setTimeout(() => {
      this.gameFinishSubject.next(true);
    }, 2000);
  }
}
