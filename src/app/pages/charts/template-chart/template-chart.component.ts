import {Component, inject, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ChartsService} from "../../../services/charts.service";
import {take} from "rxjs";
import TemplatesChart from "../../../models/templatesChart";

@Component({
  selector: 'app-template-chart',
  standalone: true,
  imports: [
    BaseChartDirective
  ],
  templateUrl: './template-chart.component.html',
  styleUrl: './template-chart.component.scss'
})
export class TemplateChartComponent implements OnInit {
  constructor() {
  }

  private chartsService = inject(ChartsService);
  public SystemName: string = "Договора"

  public lineChartData: Array<number> = []
  public lineChartLabels: Array<string> = [];
  public labelMFL: Array<any> = [];

  getChartData() {
    this.chartsService.getTemplatesChartData().pipe(take(1)).subscribe((data: TemplatesChart[]) => {
      this.lineChartData = data.map(contract => contract.contract_count);
      this.lineChartLabels = data.map(contract => contract.template_name);
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
        text: "Перечень заключенных договоров",
      },
      maintainAspectRatio: false
    },
  };

}