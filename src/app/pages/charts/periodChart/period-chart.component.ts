import {Component, inject, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import PeriodChart from "../../../models/periodChart";
import {MatButton} from "@angular/material/button";
import {take} from "rxjs";
import {ChartsService} from "../../../services/charts.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatButton
  ],
  templateUrl: './period-chart.component.html',
  styleUrl: './period-chart.component.scss'
})
export class PeriodChartComponent implements OnInit {
  constructor() {}

  private chartsService = inject(ChartsService);
  private router = inject(Router)

  public SystemName: string = "Договора"
  public lineChartData: Array<number> = []
  public lineChartLabels: Array<string> = [];
  public labelMFL: Array<any> = [];

  getChartData() {
    this.chartsService.getPeriodChartData().pipe(take(1)).subscribe((data: PeriodChart[]) => {
      this.lineChartData = data.map(contract => contract.contract_count);
      this.lineChartLabels = data.map(contract => contract.period);
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
        text: "Количество оформленных договоров на период времени",
      },
      maintainAspectRatio: false
    },
  };

  backToAdmin(){
    this.router.navigate(['/admin/charts'])
  }
}
