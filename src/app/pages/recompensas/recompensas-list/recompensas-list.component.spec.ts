import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecompensasListComponent } from './recompensas-list.component';

describe('RecompensasListComponent', () => {
  let component: RecompensasListComponent;
  let fixture: ComponentFixture<RecompensasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecompensasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecompensasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
