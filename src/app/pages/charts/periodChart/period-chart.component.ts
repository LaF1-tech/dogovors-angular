import {Component, ElementRef, inject, OnInit, ViewChild} from '@angular/core';
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
  @ViewChild('chart') chart!: ElementRef<HTMLCanvasElement>;
  public SystemName: string = "Договора"
  public lineChartData: Array<number> = []
  public lineChartLabels: Array<string> = [];
  public labelMFL: Array<any> = [];
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
        text: "Количество оформленных договоров в разрезе месяца",
      },
      maintainAspectRatio: false
    },
  };
  private chartsService = inject(ChartsService);
  private router = inject(Router)
  private canvas!: HTMLCanvasElement;

  constructor() {
  }

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

  backToAdmin() {
    this.router.navigate(['/admin/charts'])
  }

  exportChart() {
    if (this.chart && this.chart.nativeElement) {
      const canvas = this.chart.nativeElement;
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = 'chart.png';
      link.click();
    } else {
      console.error('Canvas element not found!');
    }
  }
}
