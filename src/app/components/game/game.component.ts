import { Component } from '@angular/core';
import { MoveSelectorComponent } from '../move-selector/move-selector.component';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { Observable } from 'rxjs';
import { GameService } from '../../services/game.service';
import { Move } from '../../models/move.enum';
import { GameLog } from '../../models/game';

@Component({
  selector: 'game',
  standalone: true,
  imports: [MoveSelectorComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  players$:  Observable<Player[]>;
  gameLog$: Observable<GameLog | undefined>;
  roundWinnerMessage$: Observable<string>;
  
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
    this.gameLog$ = gameService.gameLog$;
    this.roundWinnerMessage$ = gameService.roundWinnerMessage$;
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
      this.updateRoundWinnerMessage(player1, player2, winner.id);
      this.gameService.updateGameLog(player1, player2, winner);
      if(player1.score >=this.WINNING_SCORE || player2.score >=this.WINNING_SCORE){ 
        this.gameService.finishGames();
      }
    }else { 
      this.updateRoundWinnerMessage(player1, player2);
    }
    setTimeout(()=> { 
      this.resetRound(false);    
    }, 2000); // want a chance to show winner for current round before resetting 
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

  updateRoundWinnerMessage(player1: Player, player2: Player, winningId?: number){ 
    if (winningId && player1 && player2) {
        const winner = player1.id === winningId ? player1 : (player2.id === winningId ? player2 : null);
        const loser = winner === player1 ? player2 : player1;
        const message = `${winner?.move} beats ${loser.move}`;
        this.gameService.setRoundWinnerMessage(message);
        if(winner){
          this.gameService.updateGameLog(player1, player2, winner);  
        }
        
    }else { 
      // no winner so it is a draw 
      const message = `${player1?.move} draws with ${player2?.move}`
      this.gameService.setRoundWinnerMessage(message);
      this.gameService.updateGameLog(player1, player2);
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
