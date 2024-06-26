import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import Contract from "../models/contract";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private http = inject(HttpClient)

  getContracts(): Observable<Contract[]> {
    return this.http.get<{ list: Contract[] }>("/api/v1/contracts")
      .pipe(map(e => e.list))
  }

  patchStatus(contract: any, contractId: number) {
    return this.http.patch('/api/v1/contracts', {
      ...contract,
      contract_id: contractId
    })
  }

  downloadPDF(id: number): Observable<Blob> {
    return this.http.get(`/api/v1/contracts/pdf/${id}`, {responseType: 'blob'})
  }
}
