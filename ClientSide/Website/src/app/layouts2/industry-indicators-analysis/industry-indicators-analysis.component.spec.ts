import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustryIndicatorsAnalysisComponent } from './industry-indicators-analysis.component';

describe('IndustryIndicatorsAnalysisComponent', () => {
  let component: IndustryIndicatorsAnalysisComponent;
  let fixture: ComponentFixture<IndustryIndicatorsAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustryIndicatorsAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndustryIndicatorsAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
