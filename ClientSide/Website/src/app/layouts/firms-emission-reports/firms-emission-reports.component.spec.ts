import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmsEmissionReportsComponent } from './firms-emission-reports.component';

describe('FirmsEmissionReportsComponent', () => {
  let component: FirmsEmissionReportsComponent;
  let fixture: ComponentFixture<FirmsEmissionReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmsEmissionReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmsEmissionReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
