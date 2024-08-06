import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { Player } from '../../models/player';
import { GameService } from '../../services/game.service';
import { Move } from '../../models/move.enum';
import { getEnumValues } from '../../shared/utils';
import { CommonModule } from '@angular/common';
import { ResetState } from '../../models/game';

export type IconMapping = {
  [key: string]: string;
};
@Component({
  selector: 'move-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './move-selector.component.html',
  styleUrl: './move-selector.component.scss',
})
export class MoveSelectorComponent {
  @Input() playerSelected: Player | null = null;
  @Output() selectedPlayerMoveEvent = new EventEmitter<Player>();

  private resetSubscription: Subscription | undefined;

  iconMapping: IconMapping = {
    Rock: 'bi bi-circle',
    Paper: 'bi bi-book',
    Scissors: 'bi bi-scissors',
  };

  items: string[] = getEnumValues(Move);
  selection: string = '';

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.resetSubscription = this.gameService.gameReset$.subscribe(
      (resetState: ResetState) => {
        if (resetState === 'TEMPLATE_AND_DATA') {
          this.clearSelection();
          this.gameService.clearRoundWinnerMesssage();
        }
      }
    );
  }

  ngOnDestroy() {
    this.resetSubscription?.unsubscribe();
  }

  private clearSelection() {
    this.selection = ' ';
    if (this.playerSelected) {
      this.gameService.clearRoundWinnerMesssage();
      this.playerSelected.move = undefined;
    }
  }

  emitSelectedMove() {
    if (this.playerSelected) {
      this.selectedPlayerMoveEvent.emit(this.playerSelected);
    }
  }

  handleSelection(selection: string) {
    this.selection = selection;
    if (this.playerSelected) {
      const select = selection.toUpperCase() as keyof typeof Move; // ok this isnt great, lets chat about this.
      this.playerSelected.move = Move[select];
      this.emitSelectedMove();
    }
  }
}
