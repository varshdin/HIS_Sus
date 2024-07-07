import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFirmComponent } from './add-firm.component';

describe('AddFirmComponent', () => {
  let component: AddFirmComponent;
  let fixture: ComponentFixture<AddFirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddFirmComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
