import {Component, inject} from '@angular/core';
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {SubmitEvent} from "@likdan/form-builder-core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";

export interface Data {
  initial: any
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatFormField,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule,
    MatButton
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {
  data = inject<Data>(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)
  contractStatuses: Food[] = [
    {value: 'Добавлено', viewValue: 'Добавлено'},
    {value: 'Проверено', viewValue: 'Проверено'},
    {value: 'Утверждено', viewValue: 'Утверждено'},
    {value: 'Исполнено', viewValue: 'Исполнено'},
    {value: 'Неисполнено', viewValue: 'Неисполнено'}
  ];

  mainForm = new FormGroup({
    contract_status: new FormControl<string>(this.data.initial.contract_status, [Validators.required]),
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


interface Food {
  value: string;
  viewValue: string;
}
