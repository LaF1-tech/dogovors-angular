import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatDialog} from "@angular/material/dialog";
import {filter, Observable, switchMap, take} from "rxjs";
import {ContractExecutionControlService} from "../../../services/contract-execution-control.service";
import {ActivatedRoute} from "@angular/router";
import ContractExecutionControl from "../../../models/contractexecutioncontrol";
import {DialogComponent} from "./dialog/dialog.component";

@Component({
  selector: 'app-execution-control',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader, DatePipe, MatFormField, MatInput, MatLabel
  ],
  templateUrl: './execution-control.component.html',
  styleUrl: './execution-control.component.scss'
})
export class ExecutionControlComponent implements AfterViewInit {
  displayedColumns: string[] = ['template_name', 'student_last_name', 'student_name', 'contract_status', 'control_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<ContractExecutionControl>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  Id!: number
  private contractExecutionControlService = inject(ContractExecutionControlService);
  private dialog = inject(MatDialog)
  private route = inject(ActivatedRoute);

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.Id = Number(this.route.snapshot.paramMap.get('id'));
    this.fetchData();
  }

  fetchData() {
    this.contractExecutionControlService.getContractsExecutionControl(this.Id).pipe(take(1))
      .subscribe((data: ContractExecutionControl[]) => {
        this.dataSource.data = data;
      });
  }

  add(contract_id: number) {
    this.openDialog()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.contractExecutionControlService.createContractExecutionControl(v.value, contract_id)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  edit(value: any) {
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.contractExecutionControlService.patchContractExecutionControl(v.value, value.id)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private openDialog(value?: any): Observable<any> {
    return this.dialog.open(DialogComponent, {
      data: {
        initial: {
          contract_status: value?.contract_status ?? '',
          control_date: value?.control_date ?? null,
        }
      },
    }).afterClosed()
  }

}
