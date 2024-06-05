import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Application} from "../../models/application";
import {ApplicationsService} from "../../services/applications.service";
import {Observable, take} from "rxjs";
import {MatSort, MatSortHeader, Sort} from "@angular/material/sort";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButton, MatSortHeader, MatSort, JsonPipe],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements AfterViewInit {
  private applicationsService = inject(ApplicationsService);
  displayedColumns: string[] = ['educational_establishment_name', 'specialization_name', 'last_name', 'name', 'middle_name', 'phone_number', 'types', 'application_status', 'execution_date', 'expiration_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<Application>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData();
  }

  fetchData() {
    this.applicationsService.getApplications()
      .pipe(take(1))
      .subscribe((data: Application[]) => {
        this.dataSource.data = data;
      });
  }

  makeApproved(id: number) {
    if (!confirm("Вы уверены что хотите одобрить?")) {
      return
    }
    this.applicationsService.makeApproved(id)

    this.fetchData()
  }

  makeRejected(id: number) {
    if (!confirm("Вы уверены что хотите отклонить?")) {
      return
    }
    this.applicationsService.makeRejected(id)

    this.fetchData()
  }

  protected readonly JsonPipe = JsonPipe;
}
