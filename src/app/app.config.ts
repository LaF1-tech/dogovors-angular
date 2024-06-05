import {ApplicationConfig, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from "ng2-charts";
import {errorHandleInterceptor} from "./services/error-handle.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorHandleInterceptor])),
    provideAnimations(),
    provideCharts(withDefaultRegisterables()),
  ]
};
