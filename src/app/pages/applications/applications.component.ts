import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Application} from "../../models/application";
import {ApplicationsService} from "../../services/applications.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-applications',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatButton],
  templateUrl: './applications.component.html',
  styleUrl: './applications.component.scss'
})
export class ApplicationsComponent implements AfterViewInit {
  private applicationsService = inject(ApplicationsService);
  displayedColumns: string[] = ['educational_establishment_name', 'specialization_name', 'last_name', 'name', 'middle_name', 'phone_number', 'types', 'application_status', 'execution_date', 'expiration_date', 'actionbuttons'];
  dataSource = new MatTableDataSource<Application>();

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  fetchData() {
    this.applicationsService.getApplications().subscribe((data: Application[]) => {
      this.dataSource.data = data;
    });
  }

  protected readonly Object = Object;
}
