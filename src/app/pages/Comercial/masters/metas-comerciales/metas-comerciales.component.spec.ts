import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetasComercialesComponent } from './metas-comerciales.component';

describe('MetasComercialesComponent', () => {
  let component: MetasComercialesComponent;
  let fixture: ComponentFixture<MetasComercialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MetasComercialesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetasComercialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
