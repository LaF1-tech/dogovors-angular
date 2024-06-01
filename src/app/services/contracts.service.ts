import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import Contract from "../models/contract";
import ContractChart from "../models/ContractChart";

@Injectable({
  providedIn: 'root'
})
export class ContractsService {
  private http = inject(HttpClient)

  getContracts(): Observable<Contract[]> {
    return this.http.get<{ list: Contract[] }>("/api/v1/contracts")
      .pipe(map(e => e.list))
  }

  getChartContracts(): Observable<ContractChart[]> {
    return this.http.get<{ list: ContractChart[] }>("/api/v1/contracts/chart")
      .pipe(map(e => e.list))
  }

  downloadPDF(id: number): Observable<Blob> {
    return this.http.get(`/api/v1/contracts/pdf/${id}`, {responseType: 'blob'})
  }
}