import { Component } from '@angular/core';
import { PlayerInputFormComponent } from '../player-input-form/player-input-form.component';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Player, PlayerType } from '../../models/player';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'welcome',
  standalone: true,
  imports: [PlayerInputFormComponent, CommonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss',
})
export class WelcomeComponent {

  instructionsMessage: string = 'Insert player 1 name';

  players$: Observable<Player[]>;
  errorMessage$: Observable<string>;
  gameState$: Observable<{ players: any[], errorMessage: string }>;


  constructor(private gameService: GameService){ 
    this.players$ = this.gameService.players$;
    this.errorMessage$ = this.gameService.errorMessage$;

    this.gameState$ = combineLatest([this.players$, this.errorMessage$]).pipe(
      map(([players, errorMessage]) => ({ players, errorMessage }))
    );
  }

   // could use this for both types of player selection
   onPlayerInput(players: Player[], isComputer?: true){ 
    if(isComputer){ 
      this.gameService.addPlayer("COMPUTER", isComputer);
    }
    if(players.length < 1){ 
      this.gameService.notifyErrorMessage('You must select at least one player');
    }else{ 
      this.gameService.notifyPlayerInput('PLAY_COMPUTER');
    }
  }
  
}
