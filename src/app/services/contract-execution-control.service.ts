import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import ContractExecutionControl from "../models/contractexecutioncontrol";

@Injectable({
  providedIn: 'root'
})
export class ContractExecutionControlService {
  private http = inject(HttpClient)

  getContractsExecutionControl(id: number): Observable<ContractExecutionControl[]> {
    return this.http.get<{ list: ContractExecutionControl[] }>(`/api/v1/cec/${id}`)
      .pipe(map(e => e.list))
  }

  createContractExecutionControl(cec: any, contract_id:number) {
    return this.http.post("/api/v1/cec", {
      ...cec,
      contract_id: contract_id
    })
  }

  patchContractExecutionControl(cec: any, id: number) {
    return this.http.patch('/api/v1/cec', {
      id: id,
      ...cec
    })
  }
}
