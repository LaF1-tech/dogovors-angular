import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Template} from "../../models/templates";
import {TemplatesService} from "../../services/templates.service";
import {filter, Observable, switchMap, take} from "rxjs";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {FormConfigDialogComponent} from "../../dialog/form-config-dialog/form-config-dialog.component";
import {FormConfigControls} from "@likdan/form-builder-core";
import {Controls} from "@likdan/form-builder-material";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements AfterViewInit {
  private dialog = inject(MatDialog)
  private templateService = inject(TemplatesService);

  displayedColumns: string[] = ['template_name', 'actionbuttons'];
  dataSource = new MatTableDataSource<Template>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.fetchData();
  }

  fetchData() {
    this.templateService.getTemplates()
      .pipe(take(1))
      .subscribe((data: Template[]) => {
        this.dataSource.data = data;
      });
  }

  private openDialog(value?: any): Observable<any> {
    return this.dialog.open(FormConfigDialogComponent, {
      data: {
        controls: <FormConfigControls>{
          template_name: {
            type: Controls.textInput,
            label: "Имя шаблона",
          },
          template_content: {
            type: Controls.textInput,
            label: "Содержание шаблона",
          },
          necessary_data: {
            type: Controls.textInput,
            label: "Необходимые данные (формат 'Название':'поле(integer)')",
          },
        },
      },
      disableClose: true,
    }).afterClosed()
  }

  add(){
    this.openDialog()
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.templateService.addTemplate(v.value)))
      .pipe(take(1))
      .subscribe(() => alert('Шаблон добавлен'))
  }

  edit(value: any) {
    this.openDialog(value)
      .pipe(filter(v => !!v))
      .pipe(switchMap(v => this.templateService.editTemplate(v.value, value.template_id)))
      .pipe(take(1))
      .subscribe(() => alert('Шаблон изменен'))
  }

  deleteTemplate(id: number) {
    if (!confirm("Вы уверены в том что хотите удалить?")) {
      return
    }

    this.templateService.deleteTemplate(id)
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }
}
