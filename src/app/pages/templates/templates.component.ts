import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Template} from "../../models/templates";
import {TemplatesService} from "../../services/templates.service";

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton
  ],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.scss'
})
export class TemplatesComponent implements AfterViewInit {
  private templateService = inject(TemplatesService);

  displayedColumns: string[] = ['template_name', 'actionbuttons'];
  dataSource = new MatTableDataSource<Template>();

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  fetchData() {
    this.templateService.getTemplates().subscribe((data: Template[]) => {
      this.dataSource.data = data;
    });
  }
}
