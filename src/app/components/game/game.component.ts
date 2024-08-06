import { Component } from '@angular/core';
import { MoveSelectorComponent } from '../move-selector/move-selector.component';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { Observable } from 'rxjs';
import { GameService } from '../../services/game.service';
import { Move } from '../../models/move.enum';

@Component({
  selector: 'game',
  standalone: true,
  imports: [MoveSelectorComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  players$:  Observable<Player[]>;
  gameFinish$: Observable<boolean>;

  currentRoundPlayers: Player[] = [];

  WINNING_SCORE:number = 2;

  getPlayerScoreforCurrentRound(playerId: number): number {
    return this.currentRoundPlayers[playerId].score;
  }

  increasePlayerScoreforCurrentRound(playerId: number) {
      this.currentRoundPlayers[playerId].score +=1;
  }

  constructor(public gameService: GameService) {
    this.players$ = gameService.players$;
    this.gameFinish$ = gameService.gameFinish$;
  }

  updateSelectedMove(playerSelectedMove: Player) {
    this.currentRoundPlayers?.push(playerSelectedMove);
    if(this.currentRoundPlayers?.length==2){
      this.winner(this.currentRoundPlayers[0], this.currentRoundPlayers[1]);
    }
  }

  winner(player1: Player, player2: Player) {
    const winner: Player | undefined = this.rockPaperScissors(player1, player2);
    if(winner){ 
      if(player1.score >=this.WINNING_SCORE || player2.score >=this.WINNING_SCORE){ 
        this.gameService.finishGames();
      }
    }
    this.resetRound(false);    
  }

  rockPaperScissors(player1: Player, player2: Player): Player | undefined {
    const p1Move = this.mapMoveToNumber(player1.move as Move);
    const p2Move = this.mapMoveToNumber(player2.move as Move);
    if ((p1Move + 1) % 3 === p2Move) {
      this.increasePlayerScoreforCurrentRound(player2.id);
      return player2;
    } else if (p1Move === p2Move) {
      return undefined;
    } else {
      this.increasePlayerScoreforCurrentRound(player1.id);
      return player1;
    }
  }

  mapMoveToNumber(move: Move): number {
    const moveMapper: { [key in Move]: number } = {
      [Move.ROCK]: 0,
      [Move.PAPER]: 1,
      [Move.SCISSORS]: 2,
    };
    return moveMapper[move];
  }

  resetRound(resetTemplating: boolean) {
    this.currentRoundPlayers = [];
    this.gameService.resetRound(resetTemplating);
  }
}
