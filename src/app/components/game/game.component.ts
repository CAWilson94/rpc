import { Component } from '@angular/core';
import { MoveSelectorComponent } from '../move-selector/move-selector.component';
import { CommonModule } from '@angular/common';
import { Player } from '../../models/player';
import { Observable } from 'rxjs';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'game',
  standalone: true,
  imports: [MoveSelectorComponent, CommonModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

  players$: Observable<Player[]>;

  constructor(gameService: GameService){  
    // do we actually want that or can we take from move selection thingy 
    // or update game service with current players from move selection -- should only do this once at the start of the game. 
    this.players$ = gameService.players$;
  }

}
