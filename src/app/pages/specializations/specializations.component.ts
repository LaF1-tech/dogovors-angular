import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Specializations} from "../../models/specializations";
import {SpecializationsService} from "../../services/specializations.service";
import {filter, Observable, switchMap, take} from "rxjs";
import {FormConfigControl, FormConfigControls} from "@likdan/form-builder-core";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {Controls} from "@likdan/form-builder-material";
import {MatSort, MatSortHeader} from "@angular/material/sort";

@Component({
  selector: 'app-specializations',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader
  ],
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.scss'
})
export class SpecializationsComponent implements AfterViewInit {
  private specializationsService = inject(SpecializationsService);
  private dialog = inject(MatDialog)

  displayedColumns: string[] = ['specialization_name', 'actionbuttons'];
  dataSource = new MatTableDataSource<Specializations>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData();
  }

  fetchData() {
    this.specializationsService.getSpecializations()
      .pipe(take(1))
      .subscribe((data: Specializations[]) => {
        this.dataSource.data = data;
      });
  }

  deleteSpecialization(id: number) {
    if (!confirm("Вы уверены в том что хотите удалить?")) {
      return
    }

    this.specializationsService.deleteSpecialization(id)
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  private openDialog(value?: any): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        controls: <FormConfigControls>{
          specialization_name: {
            type: Controls.textInput,
            label: "Имя специальности",
          }
        },
      },
      disableClose: true,
    }).afterClosed()
  }

  add() {
    this.openDialog()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.specializationsService.addSpecialization(v.value)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())

  }

  edit(value: any) {
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.specializationsService.editSpecialization(v.value, value.specialization_id)))
      .pipe(take(1))
      .subscribe(() => this.fetchData())

  }

}
