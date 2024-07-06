import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmSocialAnalysisComponent } from './firm-social-analysis.component';

describe('FirmSocialAnalysisComponent', () => {
  let component: FirmSocialAnalysisComponent;
  let fixture: ComponentFixture<FirmSocialAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmSocialAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmSocialAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
