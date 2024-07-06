import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFirmsComponent } from './view-firms.component';

describe('ViewFirmsComponent', () => {
  let component: ViewFirmsComponent;
  let fixture: ComponentFixture<ViewFirmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewFirmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
