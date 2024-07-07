import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home.component';
import { FirmesComponent as FirmsComponent } from './firmes/firmes.component';
import { SectorsComponent } from './sectors/sectors.component';
import { AddFirmComponent } from './firmes/add-firm/add-firm.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      {
        path: 'firms',
        component: FirmsComponent
      },
      {
        path: 'sectors',
        component: SectorsComponent
      },
      {
        path: 'add-firm',
        component: AddFirmComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
