import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {EducationalEstablishment} from "../models/educationalestablishment";

@Injectable({
  providedIn: 'root'
})
export class EducationEstablishmentsService {
  private http = inject(HttpClient)

  getEducationalEstablishments(): Observable<EducationalEstablishment[]> {
    return this.http.get<{ list: EducationalEstablishment[] }>("/api/v1/ee")
      .pipe(map(e => e.list))
  }

  getEducationalEstablishmentForSelect(): Observable<RawItem[]> {
    return this.getEducationalEstablishments().pipe(map(ee => ee.map(e => <RawItem>{
      value: e.educational_establishment_id, display: e.educational_establishment_name
    })))
  }

  deleteEduEstab(id: number) {
    return this.http.delete(`/api/v1/ee/${id}`)
  }

  addEduEstab(educationalEstablishment: any) {
    return this.http.post('/api/v1/ee', educationalEstablishment)
  }

  editEduEstab(educationalEstablishment: any, id: number) {
    return this.http.patch('/api/v1/ee', {
      ...educationalEstablishment, educational_establishment_id: id
    })
  }
}

interface RawItem {
  value: number;
  display: string;
}
