import {Component, inject} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  private router = inject(Router)

  toPeriodChart() {
    this.router.navigate(['/periodchart'])
  }

  toEducationalChart() {
    this.router.navigate(['/educhart'])

  }

  toSpecializationsChart() {
    this.router.navigate(['/specializationschart'])
  }

  toTemplatesChart() {
    this.router.navigate(['/templateschart'])
  }
}
