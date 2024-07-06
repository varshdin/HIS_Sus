import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutsComponent } from './layouts/layouts.component';
import { HomeComponent } from './layouts/home/home.component';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { AboutUsComponent } from './layouts/about-us/about-us.component';
import { FirmsComponent } from './layouts/firms/firms.component';
import { ContactUsComponent } from './layouts/contact-us/contact-us.component';
import { FirmsEmissionReportsComponent } from './layouts/firms-emission-reports/firms-emission-reports.component';
import { DashboardComponent } from './layouts/dashboard/dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Layouts2Component } from './layouts2/layouts2.component';
import { CommonModule } from '@angular/common';
import { FirmDetailsComponent } from './layouts2/firm-details/firm-details.component';
import { RepositoryViewComponent } from './layouts2/repository-view/repository-view.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { IndustryIndicatorsAnalysisComponent } from './layouts2/industry-indicators-analysis/industry-indicators-analysis.component';
import { EnvAnalysisComponent } from './layouts2/env-analysis/env-analysis.component';
import { FirmSocialAnalysisComponent } from './layouts2/firm-social-analysis/firm-social-analysis.component';
import { FirmTextualAnalysisComponent } from './layouts2/firm-textual-analysis/firm-textual-analysis.component';
import { FirmEnvAnalysisComponent } from './layouts2/firm-env-analysis/firm-env-analysis.component';
import { FaqComponent } from './layout2/faq/faq.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutsComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    AboutUsComponent,
    FirmsComponent,
    ContactUsComponent,
    FirmsEmissionReportsComponent,
    DashboardComponent,
    Layouts2Component,
    FirmDetailsComponent,
    RepositoryViewComponent,
    IndustryIndicatorsAnalysisComponent,
    EnvAnalysisComponent,
    FirmSocialAnalysisComponent,
    FirmTextualAnalysisComponent,
    FirmEnvAnalysisComponent,
    FaqComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CarouselModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    CommonModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
