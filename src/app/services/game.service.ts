import { Injectable } from '@angular/core';
import { BehaviorSubject, map, max, Observable, timeInterval } from 'rxjs';
import { Player } from '../models/player';
import { GameLog, ResetState } from '../models/game';
import { Round } from '../models/round';

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

  private roundWinnerMessageSubject = new BehaviorSubject<string>('');
  roundWinnerMessage$ = this.roundWinnerMessageSubject.asObservable();

  private gameLogSubject = new BehaviorSubject<GameLog | undefined>({
    gameFinished: false,
    gameRounds: [],
  });
  gameLog$ = this.gameLogSubject.asObservable();

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

  getClearErrorMessage() {
    return this.errorMessageSubject.value;
  }

  setRoundWinnerMessage(message: string) {
    this.roundWinnerMessageSubject.next(message);
  }

  getRoundWinnerMessage(){ 
    return this.roundWinnerMessageSubject.value;
  }

  clearRoundWinnerMesssage() {
    this.roundWinnerMessageSubject.next('');
  }

  getGameLog(){ 
    return this.gameLogSubject.value;
  }

  addPlayer(playerName: string, isPlayerComputer: boolean) {
    const currentPlayers: Player[] = this.playersSubject.getValue();
    if (currentPlayers.length >= this.MAX_PLAYERS) {
      console.warn(`Cannot add more than ${this.MAX_PLAYERS}`);
      return;
    }
    const newPlayer: Player = {
      name: playerName,
      id: this.nextPlayerId++,
      score: 0,
      isComputer: isPlayerComputer,
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

  async finishGames() {
    setTimeout(async () => {
      const winningPlayer = await this.getGameWinner();
      this.gameLogSubject.next({
        gameFinished: true,
        gameWinner: this.getGameWinner(),
      });
    }, 0);
  }

  getGameWinner() {
    if (this.gameLogSubject.value && this.gameLogSubject.value.gameRounds) {
      const rounds = this.gameLogSubject?.value?.gameRounds;
      const latestRound = rounds[rounds.length - 1];
      const winningPlayer = latestRound.players.reduce(
        (maxPlayer, currentPlayer) => {
          return currentPlayer.score > maxPlayer.score
            ? currentPlayer
            : maxPlayer;
        }
      );
      return winningPlayer;
    }
    return undefined;
  }

  updateGameLog(player1: Player, player2: Player, winningPlayer?: Player) {
    const currentLog = this.gameLogSubject.value;
    const gameRounds: Round[] = this.gameLogSubject.value?.gameRounds || [];
    const roundNumber: number = currentLog?.gameRounds?.length ?? 0;
    const newRound: Round = {
      roundNumber: roundNumber,
      players: [player1, player2],
      winner: winningPlayer,
    };
    if (currentLog) {
      this.gameLogSubject.next({
        ...currentLog,
        gameRounds: [...gameRounds, newRound],
      });
    }
  }


}
