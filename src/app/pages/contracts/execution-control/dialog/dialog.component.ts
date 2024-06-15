import {Component, inject, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {NgxMaskDirective} from "ngx-mask";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {SubmitEvent} from "@likdan/form-builder-core";

export interface Data {
  initial: any
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    NgxMaskDirective,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatHint,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  @ViewChild(MatDatepicker) datepicker!: MatDatepicker<Date>;
  data = inject<Data>(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)
  mainForm = new FormGroup({
    contract_status: new FormControl<string>(this.data.initial.contract_status, [Validators.required, Validators.minLength(5)]),
    control_date: new FormControl<Date | null>(this.data.initial.control_date, [Validators.required]),
  });

  onSubmit() {
    if (!this.mainForm.valid) {
      return;
    }

    const event: SubmitEvent<any> = {
      value: this.mainForm.value, valid: this.mainForm.valid, errors: this.mainForm.errors,
    };

    const out = {
      value: event.value
    }

    this.dialogRef.close(out)
  }
}
