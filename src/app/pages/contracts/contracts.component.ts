import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import Contract from "../../models/contract";
import {Application} from "../../models/application";
import {ContractsService} from "../../services/contracts.service";

@Component({
  selector: 'app-contracts',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton
  ],
  templateUrl: './contracts.component.html',
  styleUrl: './contracts.component.scss'
})
export class ContractsComponent implements AfterViewInit {
  private contractsService = inject(ContractsService);

  displayedColumns: string[] = ['student_name', 'student_last_name', 'employee_first_name', 'employee_last_name', 'application_type', 'execution_date', 'expiration_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<Contract>();

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }


  fetchData() {
    this.contractsService.getContracts().subscribe((data: Contract[]) => {
      this.dataSource.data = data;
    });
  }
}
