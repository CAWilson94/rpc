import { Component, EventEmitter, Input, Output, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../services/game.service';

@Component({
  selector: 'player-input-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './player-input-form.component.html',
  styleUrl: './player-input-form.component.scss',
})
export class PlayerInputFormComponent {
  @Input() instructionsMessage = '';
  
  playerName: string = '';
  
  constructor(private gameService: GameService) {
  }

  onSubmit = (): void => {
    if (this.playerName) {
      this.gameService.addPlayer(this.playerName);
      this.playerName ='';
    }
  };
}
