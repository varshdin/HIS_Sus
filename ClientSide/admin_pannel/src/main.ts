// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

// bootstrapApplication(AppComponent, {
//   providers: [
//     provideRouter(routes),
//     importProvidersFrom(HttpClientModule), provideAnimationsAsync()
//   ]
// }).catch(err => console.error(err));
platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
