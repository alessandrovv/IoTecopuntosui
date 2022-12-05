import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateBancoComponent } from './save-update-banco.component';

describe('SaveUpdateBancoComponent', () => {
  let component: SaveUpdateBancoComponent;
  let fixture: ComponentFixture<SaveUpdateBancoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateBancoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateBancoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
