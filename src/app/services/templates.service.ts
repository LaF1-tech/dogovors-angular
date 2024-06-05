import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {RawItem} from "@likdan/form-builder-material";
import {Template} from "../models/templates";

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {
  private http = inject(HttpClient)

  getTemplates(): Observable<Template[]> {
    return this.http.get<{ list: Template[] }>("/api/v1/templates")
      .pipe(map(e => e.list))
  }

  getTemplatesForSelect(): Observable<RawItem[]> {
    return this.getTemplates().pipe(map(tt => tt.map(t => <RawItem>{
      value: t.template_id,
      display: t.template_name
    })))
  }

  loadOne(id: number): Observable<Template> {
    return this.http.get<Template>(`/api/v1/templates/${id}`)
  }

  deleteTemplate(id: number) {
    return this.http.delete(`/api/v1/templates/${id}`)
  }

  addTemplate(template: any) {
    return this.http.post("/api/v1/templates", template)
  }

  editTemplate(template: any, id: number) {
    return this.http.patch(`/api/v1/templates`, {
      ...template,
      template_id: id,
    })
  }
}
