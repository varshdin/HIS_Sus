import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFirmsComponent } from './add-firms.component';

describe('AddFirmsComponent', () => {
  let component: AddFirmsComponent;
  let fixture: ComponentFixture<AddFirmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFirmsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFirmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
