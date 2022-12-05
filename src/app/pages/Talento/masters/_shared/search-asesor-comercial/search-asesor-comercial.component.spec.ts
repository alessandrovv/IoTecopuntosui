import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAsesorComercialComponent } from './search-asesor-comercial.component';

describe('SearchAsesorComercialComponent', () => {
  let component: SearchAsesorComercialComponent;
  let fixture: ComponentFixture<SearchAsesorComercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchAsesorComercialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchAsesorComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
