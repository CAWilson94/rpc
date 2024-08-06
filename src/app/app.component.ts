import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { delay, Observable, of, switchMap, timeInterval } from 'rxjs';
import { Player } from './models/player';
import { CommonModule } from '@angular/common';
import { GameService } from './services/game.service';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { GameComponent } from './components/game/game.component';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, WelcomeComponent, GameComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'rock-paper-scissors';

  players$: Observable<Player[]>;
  playerInput$ = this.gameService.playerInput$;

  gameState: string = '';

  constructor(private gameService: GameService){
    this.players$ = this.gameService.players$.pipe(
      switchMap(players => { 
        if(players.length === 2){ 
          return of(players).pipe(delay(2000));
        }
        return of(players);
      })
    );
  }

  ngOnInit(){ 
    this.gameService.playerInput$.subscribe((state: string)=> { 
      this.gameState = state;
    })
  }
}
