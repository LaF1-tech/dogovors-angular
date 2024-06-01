import {Component, inject, OnInit} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {ContractsService} from "../../services/contracts.service";
import ContractChart from "../../models/ContractChart";
import {MatButton} from "@angular/material/button";
import {take} from "rxjs";

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatButton
  ],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  constructor() {
  }

  private contractsService = inject(ContractsService)
  public SystemName: string = "Договора"

  public lineChartData: Array<number> = []
  public lineChartLabels: Array<string> = [];
  public labelMFL: Array<any> = [];

  getChartData() {
    this.contractsService.getChartContracts().pipe(take(1)).subscribe((data: ContractChart[]) => {
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

  protected readonly console = console;
}
