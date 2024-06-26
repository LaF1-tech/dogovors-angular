import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Template} from "../../models/templates";
import {TemplatesService} from "../../services/templates.service";
import {take} from "rxjs";
import {MatSort, MatSortHeader} from "@angular/material/sort";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {Router} from "@angular/router";

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton, MatSort, MatSortHeader, MatFormField, MatInput, MatLabel
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements AfterViewInit {
  displayedColumns: string[] = ['template_name', 'actionbuttons'];
  dataSource = new MatTableDataSource<Template>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  private router = inject(Router)
  private templateService = inject(TemplatesService);

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

  add() {
    this.router.navigate(['/create-template'])
  }

  edit(id: any) {
    this.router.navigate([`/edit-template/${id}`])
  }

  deleteTemplate(id: number) {
    if (!confirm("Вы уверены в том что хотите удалить?")) {
      return
    }

    this.templateService.deleteTemplate(id)
      .pipe(take(1))
      .subscribe(() => this.fetchData())
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
