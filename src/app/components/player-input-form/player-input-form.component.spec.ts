import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerInputFormComponent } from './player-input-form.component';

describe('PlayerInputFormComponent', () => {
  let component: PlayerInputFormComponent;
  let fixture: ComponentFixture<PlayerInputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayerInputFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerInputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
