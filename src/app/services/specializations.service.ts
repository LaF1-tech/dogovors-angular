import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable, take} from "rxjs";
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

  deleteSpecialization(id: number) {
    return this.http.delete(`/api/v1/specializations/${id}`)
  }

  addSpecialization(specialization: any) {
    return this.http.post("/api/v1/specializations", specialization)
  }

  editSpecialization(specialization: any, id: number) {
    return this.http.patch("/api/v1/specializations", {
      ...specialization,
      specialization_id: id,
    })
  }
}
