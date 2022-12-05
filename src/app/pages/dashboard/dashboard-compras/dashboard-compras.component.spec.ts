import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComprasComponent } from './dashboard-compras.component';

describe('DashboardComprasComponent', () => {
  let component: DashboardComprasComponent;
  let fixture: ComponentFixture<DashboardComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComprasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
