import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmEnvAnalysisComponent } from './firm-env-analysis.component';

describe('FirmEnvAnalysisComponent', () => {
  let component: FirmEnvAnalysisComponent;
  let fixture: ComponentFixture<FirmEnvAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmEnvAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmEnvAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
