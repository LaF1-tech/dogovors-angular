import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {RawItem} from "@likdan/form-builder-material";
import {Specializations} from "../models/specializations";

@Injectable({
  providedIn: 'root'
})
export class SpecializationsService {
  private http = inject(HttpClient)

  getSpecializations(): Observable<Specializations[]> {
    return this.http.get<{ list: Specializations[] }>("/api/v1/specializations")
      .pipe(map(e => e.list))
  }

  getSpecializationForSelect(): Observable<RawItem[]> {
    return this.getSpecializations().pipe(map(ee => ee.map(e => <RawItem>{
      value: e.specialization_id,
      display: e.specialization_name
    })))
  }
}
