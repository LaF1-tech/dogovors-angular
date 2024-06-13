import {Component, ElementRef, inject, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {Router} from "@angular/router";
import {MatButton} from "@angular/material/button";
import {ChartsService} from "../../../services/charts.service";
import {take} from "rxjs";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {
  MatDatepickerToggle,
  MatDateRangeInput,
  MatDateRangePicker,
  MatEndDate,
  MatStartDate
} from "@angular/material/datepicker";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import PeriodChart from "../../../models/periodChart";

@Component({
  selector: 'app-period-user-chart',
  standalone: true,
  imports: [
    BaseChartDirective,
    MatButton,
    MatFormField,
    MatLabel,
    MatDateRangeInput,
    MatDateRangePicker,
    MatDatepickerToggle,
    MatEndDate,
    MatStartDate,
    MatSuffix,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './period-user-chart.component.html',
  styleUrl: './period-user-chart.component.scss'
})
export class PeriodUserChartComponent {
  @ViewChild('chart') chart!: ElementRef<HTMLCanvasElement>;
  range = new FormGroup({
    start: new FormControl<Date | null>(null, [Validators.required]),
    end: new FormControl<Date | null>(null, [Validators.required]),
  });
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
        text: "Количество оформленных договоров в временном периоде",
      },
      maintainAspectRatio: false
    },
  };
  public isLoading: boolean = false;
  private router = inject(Router)
  private chartsService = inject(ChartsService);

  onSubmit() {
    if (this.range.valid) {
      this.getChartData();
    }
  }

  updateChartData() {
    this.labelMFL = [
      {
        data: this.lineChartData,
        label: this.SystemName
      }
    ];
  }

  getChartData() {
    this.isLoading = true;
    this.chartsService.getPeriodUserChartData(this.range.value).pipe(take(1)).subscribe((data: PeriodChart[]) => {
      this.lineChartData = data.map(contract => contract.contract_count);
      this.lineChartLabels = data.map(contract => contract.period);
      this.updateChartData();
      this.isLoading = false;
    });
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
