import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmDetailsComponent } from './firm-details.component';

describe('FirmDetailsComponent', () => {
  let component: FirmDetailsComponent;
  let fixture: ComponentFixture<FirmDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FirmDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FirmDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
