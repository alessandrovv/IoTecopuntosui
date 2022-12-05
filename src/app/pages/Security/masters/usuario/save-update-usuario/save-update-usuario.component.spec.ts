import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateUsuarioComponent } from './save-update-usuario.component';

describe('SaveUpdateUsuarioComponent', () => {
  let component: SaveUpdateUsuarioComponent;
  let fixture: ComponentFixture<SaveUpdateUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateUsuarioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
