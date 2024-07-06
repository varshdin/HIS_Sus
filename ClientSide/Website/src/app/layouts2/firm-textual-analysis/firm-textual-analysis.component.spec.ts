import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmTextualAnalysisComponent } from './firm-textual-analysis.component';

describe('FirmTextualAnalysisComponent', () => {
  let component: FirmTextualAnalysisComponent;
  let fixture: ComponentFixture<FirmTextualAnalysisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmTextualAnalysisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmTextualAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
