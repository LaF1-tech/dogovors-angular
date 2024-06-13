import {ApplicationConfig, LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideAnimations} from "@angular/platform-browser/animations";
import {provideNativeDateAdapter} from "@angular/material/core";
import {provideHttpClient, withInterceptors} from "@angular/common/http";
import {provideCharts, withDefaultRegisterables} from "ng2-charts";
import {errorHandleInterceptor} from "./services/error-handle.interceptor";
import {registerLocaleData} from "@angular/common";
import localeRu from '@angular/common/locales/ru';
import {provideEnvironmentNgxMask} from "ngx-mask";

registerLocaleData(localeRu)

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideNativeDateAdapter(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([errorHandleInterceptor])),
    provideAnimations(),
    provideEnvironmentNgxMask(),
    provideNativeDateAdapter(),
    {provide: LOCALE_ID, useValue: 'ru'},
    provideCharts(withDefaultRegisterables()),
  ]
};
