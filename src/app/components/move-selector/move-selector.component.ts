import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Player } from '../../models/player';
import { GameService } from '../../services/game.service';
import { Move } from '../../models/move.enum';
import { getEnumValues } from '../../shared/utils';


export type IconMapping = { 
  [key: string]: string;
}
@Component({
  selector: 'move-selector',
  standalone: true,
  imports: [],
  templateUrl: './move-selector.component.html',
  styleUrl: './move-selector.component.scss'
})
export class MoveSelectorComponent {
  @Input() playerSelected: Player | null = null;
  iconMapping: IconMapping = { 
    Rock: 'bi bi-circle', 
    Paper: 'bi bi-book',
    Scissors: 'bi bi-scissors',
  }

  items: string[] = getEnumValues(Move)
  selection: string = '';

  constructor(private gameService: GameService){ 

  }

  handleSelection(selection: string){ 
    // go to last item in the rounds.players array
    this.selection = selection;
    console.log(`players: ${this.playerSelected}`)
    if(this.playerSelected){ 
      const select = selection.toUpperCase() as keyof typeof Move; // ok this isnt great, lets chat about this. 
      // EVERY TIME YOU CALL YOU UPDATE THE CURRENT PLAYER MOVE WITH THIS
      //const roundNumber = this.gameService.getLastRound()?.roundNumber; // lets clean this up after
      //this.gameService.updatePlayerMove(this.playerSelected,this.playerSelected.id, select);
      //this.gameService.updateSinglePlayerMove(select, this.playerSelected.id);
    }
  }

}

