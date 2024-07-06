import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompaniesComponent } from './companies.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { CompanyResourcesComponent } from './company-resources/company-resources.component';

const routes: Routes = [
  {
    path: '',
    component: CompaniesComponent,
  },
  {
    path: 'new-company',
    component: CompanyDetailsComponent
  }, 
  {
    path:'resources/:id',
    component:CompanyResourcesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompaniesRoutingModule { }