import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import Contract from "../../models/contract";
import {ContractsService} from "../../services/contracts.service";
import {take} from "rxjs";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {DatePipe} from "@angular/common";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader, DatePipe, MatFormField, MatInput, MatLabel
  ],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss'
})
export class ContractsComponent implements AfterViewInit {
  displayedColumns: string[] = ['student_name', 'student_last_name', 'employee_first_name', 'employee_last_name', 'template_name', 'execution_date', 'expiration_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<Contract>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private contractsService = inject(ContractsService);
  private router = inject(Router)


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData();
  }


  fetchData() {
    this.contractsService.getContracts().pipe(take(1))
      .subscribe((data: Contract[]) => {
        this.dataSource.data = data;
      });
  }

  downloadPDF(id: number) {
    this.contractsService.downloadPDF(id).pipe(take(1)).subscribe((data) => {
      const blob = new Blob([data], {type: 'application/pdf'});
      const url = window.URL.createObjectURL(blob);
      window.open(url);
    })
  }

  control(id: number) {
    this.router.navigate([`admin/contracts/${id}`]).then(r => r)
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
