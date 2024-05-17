import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {EducationEstablishmentsService} from "../../services/education-establishments.service";
import {EducationalEstablishment} from "../../models/educationalestablishment";
import {Application} from "../../models/application";


@Component({
  selector: 'app-eduestablishments',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton
  ],
  templateUrl: './eduestablishments.component.html',
  styleUrl: './eduestablishments.component.scss'
})
export class EduestablishmentsComponent implements AfterViewInit {
  private educationalEstablishmentService = inject(EducationEstablishmentsService);
  displayedColumns: string[] = ['educational_establishment_name', 'educational_establishment_contact_phone', 'actionbuttons'];
  dataSource = new MatTableDataSource<EducationalEstablishment>();

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  fetchData() {
    this.educationalEstablishmentService.getEducationalEstablishments().subscribe((data: EducationalEstablishment[]) => {
      this.dataSource.data = data;
    });
  }
}
