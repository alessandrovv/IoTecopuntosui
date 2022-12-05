import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateMetasComercialesComponent } from './save-update-metas-comerciales.component';

describe('SaveUpdateMetasComercialesComponent', () => {
  let component: SaveUpdateMetasComercialesComponent;
  let fixture: ComponentFixture<SaveUpdateMetasComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateMetasComercialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateMetasComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
