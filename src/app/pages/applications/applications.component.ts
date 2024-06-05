import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Application} from "../../models/application";
import {ApplicationsService} from "../../services/applications.service";
import {take} from "rxjs";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {DatePipe, JsonPipe} from "@angular/common";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButton, MatSortHeader, MatSort, JsonPipe, DatePipe, MatInput, FormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements AfterViewInit {
  displayedColumns: string[] = ['educational_establishment_name', 'specialization_name', 'last_name', 'name', 'middle_name', 'phone_number', 'types', 'application_status', 'execution_date', 'expiration_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<Application>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private applicationsService = inject(ApplicationsService);

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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
