import { Component } from '@angular/core';
import { MoveSelectorComponent } from '../move-selector/move-selector.component';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { BehaviorSubject, map, Observable } from 'rxjs';
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
  players$: Observable<Player[]>;

  currentRoundPlayers: Player[] = [];

  getPlayerScoreforCurrentRound(playerId: number): number {
    return this.currentRoundPlayers[playerId].score;
  }

  increasePlayerScoreforCurrentRound(playerId: number) {
      this.currentRoundPlayers[playerId].score +=1;
  }

  constructor(public gameService: GameService) {
    this.players$ = gameService.players$;
  }

  updateSelectedMove(playerSelectedMove: Player) {
    this.currentRoundPlayers?.push(playerSelectedMove);
    if(this.currentRoundPlayers?.length==2){ 
      this.winner(this.currentRoundPlayers[0], this.currentRoundPlayers[1]);
    }
  }

  /**
   * nothing calls this yet. we need to know when two moves have been made. 
   * @param player1 
   * @param player2 
   */
  winner(player1: Player, player2: Player) {
    const winner: Player | undefined = this.rockPaperScissors(player1, player2);
    if(winner){ 
      // check which player was winner and replace them with winner 
      console.log( `Score is ${player1.name} : ${this.currentRoundPlayers[player1.id].score} /  ${player2.name} ${this.currentRoundPlayers[player2.id].score} `);
    }else { 
      console.log( `DRAW ${player1.name} : ${this.currentRoundPlayers[player1.id].score} / ${player2.name} ${this.currentRoundPlayers[player2.id].score} `);
    }

    this.resetRound();    
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

  resetRound() {
    /**
     * clear round items
     * means we need to again add players. 
     */
    //const updatedRoundPlayers: Omit<Player, 'move'>[] = this.currentRoundPlayers.map(({ move, ...rest }) => rest);
    this.currentRoundPlayers = [];
    console.log('Resetting round');
    this.gameService.resetRound();
  }
}
