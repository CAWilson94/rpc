import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Output() selectedPlayerMoveEvent = new EventEmitter<Player>()

  iconMapping: IconMapping = { 
    Rock: 'bi bi-circle', 
    Paper: 'bi bi-book',
    Scissors: 'bi bi-scissors',
  }

  items: string[] = getEnumValues(Move)
  selection: string = '';

  

  constructor(private gameService: GameService){ 

  }

  emitSelectedMove(){ 
    if(this.playerSelected){ 
      this.selectedPlayerMoveEvent.emit(this.playerSelected);
    }
  }

  handleSelection(selection: string){ 
    // emit a move selected
    this.selection = selection;
    console.log(`players: ${this.playerSelected}`)
    if(this.playerSelected){ 
      const select = selection.toUpperCase() as keyof typeof Move; // ok this isnt great, lets chat about this. 
      this.playerSelected.move = Move[select];
        this.emitSelectedMove();
    }
  }

}

