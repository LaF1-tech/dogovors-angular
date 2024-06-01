import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideHttpClient} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from "ng2-charts";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    provideCharts(withDefaultRegisterables())
  ]
};
