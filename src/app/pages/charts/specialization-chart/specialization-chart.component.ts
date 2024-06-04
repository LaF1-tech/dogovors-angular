import {Component, inject, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartsService} from "../../../services/charts.service";
import {take} from "rxjs";
import SpecializationsChart from "../../../models/specializationsChart";

@Component({
  selector: 'app-specialization-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './specialization-chart.component.html',
  styleUrl: './specialization-chart.component.scss'
})
export class SpecializationChartComponent implements OnInit {
  constructor() {
  }

  private chartsService = inject(ChartsService);
  public SystemName: string = "Договора"

  public lineChartData: Array<number> = []
  public lineChartLabels: Array<string> = [];
  public labelMFL: Array<any> = [];

  getChartData() {
    this.chartsService.getSpecializationsChartData().pipe(take(1)).subscribe((data: SpecializationsChart[]) => {
      this.lineChartData = data.map(contract => contract.contract_count);
      this.lineChartLabels = data.map(contract => contract.specialization_name);
      this.updateChartData();
    });
  }

  ngOnInit() {
    this.getChartData();
  }

  updateChartData() {
    this.labelMFL = [
      {
        data: this.lineChartData,
        label: this.SystemName
      }
    ];
  }

  public lineChartOptions: any = {
    responsive: true,
    scales: {
      x: {},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Количество оформленных договоров по Специальности",
      },
      maintainAspectRatio: false
    },
  };

}
