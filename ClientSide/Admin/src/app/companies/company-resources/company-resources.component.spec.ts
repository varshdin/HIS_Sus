import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyResourcesComponent } from './company-resources.component';

describe('CompanyResourcesComponent', () => {
  let component: CompanyResourcesComponent;
  let fixture: ComponentFixture<CompanyResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyResourcesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CompanyResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
