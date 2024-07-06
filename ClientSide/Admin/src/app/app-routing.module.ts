import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [

    {
        path: 'admin',
        loadChildren: () =>
            import('./admin-panel/admin-panel.module').then((m) => m.AdminPanelComponentModule),
    },
    {
        path: '',
        redirectTo:'admin',
        pathMatch:'full'
    },

];
@NgModule({
    imports: [
        RouterModule.forRoot(routes),
    ],
    exports: [RouterModule],
})
export class AppRoutingModule { }