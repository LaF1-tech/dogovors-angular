import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import PeriodChart from "../models/periodChart";
import EducationalEstablishmentsChart from "../models/educationalEstablishmentsChart";
import SpecializationsChart from "../models/specializationsChart";
import TemplatesChart from "../models/templatesChart";

@Injectable({
  providedIn: 'root'
})
export class ChartsService {
  private http = inject(HttpClient)

  getPeriodChartData(): Observable<PeriodChart[]> {
    return this.http.get<{ list: PeriodChart[] }>("/api/v1/charts/period")
      .pipe(map(e => e.list))
  }

  getPeriodUserChartData(dateRange: any): Observable<PeriodChart[]> {
    return this.http.put<{ list: PeriodChart[] }>("/api/v1/charts/userperiod", {
      ...dateRange
    }).pipe(map(e => e.list))
  }

  getEducationalEstablishmentChartData(): Observable<EducationalEstablishmentsChart[]> {
    return this.http.get<{ list: EducationalEstablishmentsChart[] }>("/api/v1/charts/educationalestablishments")
      .pipe(map(e => e.list))
  }

  getSpecializationsChartData(): Observable<SpecializationsChart[]> {
    return this.http.get<{ list: SpecializationsChart[] }>("/api/v1/charts/specializations")
      .pipe(map(e => e.list))
  }

  getTemplatesChartData(): Observable<TemplatesChart[]> {
    return this.http.get<{ list: TemplatesChart[] }>("/api/v1/charts/templates")
      .pipe(map(e => e.list))
  }
}
