import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './layout2/faq/faq.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { FirmDetailsComponent } from './layouts2/firm-details/firm-details.component';
import { FirmEnvAnalysisComponent } from './layouts2/firm-env-analysis/firm-env-analysis.component';
import { FirmSocialAnalysisComponent } from './layouts2/firm-social-analysis/firm-social-analysis.component';
import { FirmTextualAnalysisComponent } from './layouts2/firm-textual-analysis/firm-textual-analysis.component';
import { IndustryIndicatorsAnalysisComponent } from './layouts2/industry-indicators-analysis/industry-indicators-analysis.component';
import { Layouts2Component } from './layouts2/layouts2.component';
import { RepositoryViewComponent } from './layouts2/repository-view/repository-view.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
  },
  {
    path: '',
    component: Layouts2Component,
    children: [
      {
        path: 'firm/details/:_id',
        component: FirmDetailsComponent
      },
      {
        path: 'ind_analysis',
        component: IndustryIndicatorsAnalysisComponent
      },
      {
        path: 'env_analysis',
        component: FirmEnvAnalysisComponent
      },
      {
        path: 'social_analysis',
        component: FirmSocialAnalysisComponent
      },
      {
        path: 'textual_analysis',
        component: FirmTextualAnalysisComponent
      },
      {
        path: 'repository/view',
        component: RepositoryViewComponent
      },
      {
        path: 'faq',
        component: FaqComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
