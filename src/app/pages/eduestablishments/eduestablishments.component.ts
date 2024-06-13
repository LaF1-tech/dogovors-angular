import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {EducationEstablishmentsService} from "../../services/education-establishments.service";
import {EducationalEstablishment} from "../../models/educationalestablishment";
import {filter, Observable, switchMap, take} from "rxjs";
import {MatDialog} from "@angular/material/dialog";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {DialogComponent} from "./dialog/dialog.component";


@Component({
  selector: 'app-eduestablishments',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader, MatFormField, MatInput, MatLabel
  ],
  templateUrl: './eduestablishments.component.html',
  styleUrl: './eduestablishments.component.scss'
})
export class EduestablishmentsComponent implements AfterViewInit {
  displayedColumns: string[] = ['educational_establishment_name', 'educational_establishment_contact_phone', 'actionbuttons'];
  dataSource = new MatTableDataSource<EducationalEstablishment>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private educationalEstablishmentService = inject(EducationEstablishmentsService);
  private dialog = inject(MatDialog)

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData();
  }

  fetchData() {
    this.educationalEstablishmentService.getEducationalEstablishments()
      .pipe(take(1))
      .subscribe((data: EducationalEstablishment[]) => {
        this.dataSource.data = data;
      });
  }

  deleteEducationalEstablishment(id: number) {
    if (!confirm('Вы уверены в том что хотите удалить?')) {
      return
    }
    this.educationalEstablishmentService.deleteEduEstab(id)
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  add() {
    this.openDialog()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.educationalEstablishmentService.addEduEstab(v.value)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  edit(value: any) {
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.educationalEstablishmentService.editEduEstab(v.value, value.educational_establishment_id)))
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
          educational_establishment_name: value?.educational_establishment_name ?? '',
          educational_establishment_contact_phone: value?.educational_establishment_contact_phone ?? '',
        }
      },
    }).afterClosed()
  }
}
