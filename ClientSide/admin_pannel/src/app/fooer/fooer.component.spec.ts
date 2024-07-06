import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooerComponent } from './fooer.component';

describe('FooerComponent', () => {
  let component: FooerComponent;
  let fixture: ComponentFixture<FooerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FooerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
