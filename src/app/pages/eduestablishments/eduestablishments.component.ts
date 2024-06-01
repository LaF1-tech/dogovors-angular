import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {EducationEstablishmentsService} from "../../services/education-establishments.service";
import {EducationalEstablishment} from "../../models/educationalestablishment";
import {filter, Observable, switchMap, take} from "rxjs";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {FormConfigControls} from "@likdan/form-builder-core";
import {Controls} from "@likdan/form-builder-material";
import {MatDialog} from "@angular/material/dialog";
import {MatSort, MatSortHeader} from "@angular/material/sort";


@Component({
  selector: 'app-eduestablishments',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader
  ],
  templateUrl: './eduestablishments.component.html',
  styleUrl: './eduestablishments.component.scss'
})
export class EduestablishmentsComponent implements AfterViewInit {
  private educationalEstablishmentService = inject(EducationEstablishmentsService);
  private dialog = inject(MatDialog)

  displayedColumns: string[] = ['educational_establishment_name', 'educational_establishment_contact_phone', 'actionbuttons'];
  dataSource = new MatTableDataSource<EducationalEstablishment>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  private openDialog(value?: any): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        controls: <FormConfigControls>{
          educational_establishment_name: {
            type: Controls.textInput,
            label: "Имя учреждения образования",
          },
          educational_establishment_contact_phone: {
            type: Controls.textInput,
            label: "Контактный номер телефона",
          }
        },
      },
      disableClose: true,
    }).afterClosed()
  }

  add(){
    this.openDialog()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.educationalEstablishmentService.addEduEstab(v.value)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  edit(value: any){
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.educationalEstablishmentService.editEduEstab(v.value, value.educational_establishment_id)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }
}