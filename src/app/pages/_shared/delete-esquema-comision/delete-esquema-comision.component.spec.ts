import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEsquemaComisionComponent } from './delete-esquema-comision.component';

describe('DeleteEsquemaComisionComponent', () => {
  let component: DeleteEsquemaComisionComponent;
  let fixture: ComponentFixture<DeleteEsquemaComisionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEsquemaComisionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteEsquemaComisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
