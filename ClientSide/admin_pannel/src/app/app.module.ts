// app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { AppComponent } from './app.component';
import { AddFirmsComponent } from './Componant/add-firms/add-firms.component';
import { ViewFirmsComponent } from './Componant/view-firms/view-firms.component';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { HomeComponent } from './Componant/home/home.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooerComponent } from './fooer/fooer.component';
import { AppRoutingModule } from './app.routes';


@NgModule({
  declarations: [
    AppComponent,
    AddFirmsComponent,
    ViewFirmsComponent,
    HomeComponent,
    HeaderComponent,
    FooerComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    MatPaginator,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    AppRoutingModule,
    RouterOutlet
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
