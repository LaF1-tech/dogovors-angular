import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Application} from "../models/application";

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient)

  getApplications(): Observable<Application[]> {
    return this.http.get<{ list: Application[] }>("/api/v1/applications")
      .pipe(map(e => e.list))
  }
}
