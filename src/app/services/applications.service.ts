import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, take} from "rxjs";
import {Application, ApplicationReq} from "../models/application";

@Injectable({
  providedIn: 'root'
})
export class ApplicationsService {
  private http = inject(HttpClient)

  getApplications(): Observable<Application[]> {
    return this.http.get<{ list: Application[] }>("/api/v1/applications")
      .pipe(map(e => e.list))
  }

  create(application: ApplicationReq) {
    return this.http.post("/api/v1/applications/create", application)
  }

  makeApproved(id: number) {
    this.http.patch('/api/v1/applications', {
      id: id,
      application_status: 'Обработано'
    })
      .pipe(take(1))
      .subscribe()
  }

  makeRejected(id: number) {
    this.http.patch('/api/v1/applications', {
      id: id,
      application_status: 'Отказано'
    })
      .pipe(take(1))
      .subscribe()
  }
}
