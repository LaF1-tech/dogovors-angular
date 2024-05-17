import {AfterViewInit, Component, inject, ViewChild} from "@angular/core";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {MatPaginator, MatPaginatorModule} from "@angular/material/paginator";
import {MatButton} from "@angular/material/button";
import {Specializations} from "../../models/specializations";
import {SpecializationsService} from "../../services/specializations.service";

@Component({
  selector: 'app-specializations',
  standalone: true,
  imports: [
    MatTableModule, MatPaginatorModule, MatButton
  ],
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.scss'
})
export class SpecializationsComponent implements AfterViewInit {
  private specializationsService = inject(SpecializationsService);

  displayedColumns: string[] = ['specialization_name', 'actionbuttons'];
  dataSource = new MatTableDataSource<Specializations>();

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.fetchData();
  }

  fetchData() {
    this.specializationsService.getSpecializations().subscribe((data: Specializations[]) => {
      this.dataSource.data = data;
    });
  }
}
