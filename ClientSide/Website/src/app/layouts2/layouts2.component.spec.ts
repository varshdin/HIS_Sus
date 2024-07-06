import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Layouts2Component } from './layouts2.component';

describe('Layouts2Component', () => {
  let component: Layouts2Component;
  let fixture: ComponentFixture<Layouts2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Layouts2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Layouts2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
