import { NgModule } from '@angular/core';
import {
    Routes,RouterModule,
} from '@angular/router';
import { AdminPanelComponent } from './admin-panel.component';


const routes: Routes = [
    {
        path: '',
        component: AdminPanelComponent,
        children:[
            {
                path:'',
                loadChildren: () =>
                import('./../companies/companies.module').then((m) => m.CompaniesModule)
            },
            
        ]
        
    },
    


];
@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule],
})
export class AdminPanelRoutingModule { }