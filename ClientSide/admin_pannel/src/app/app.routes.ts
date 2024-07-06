// app.routes.ts
import { RouterModule, Routes } from '@angular/router';
import { AddFirmsComponent } from './Componant/add-firms/add-firms.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './Componant/home/home.component';
import { NgModule } from '@angular/core';
// Import new component

export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '', 
        component: HomeComponent
      },
      { path: 'add_firms', component: AddFirmsComponent },
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
  providers: [],
})
export class AppRoutingModule {}
