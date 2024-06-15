import {Component, inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgxMaskDirective} from "ngx-mask";
import {MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {SubmitEvent} from "@likdan/form-builder-core";

export interface Data {
  initial: any
}

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule, NgxMaskDirective, MatLabel, MatFormField, MatInput, MatButton,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent implements OnInit {
  data = inject<Data>(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)
  mainForm = new FormGroup({
    educational_establishment_name: new FormControl<string>(this.data.initial.educational_establishment_name, [Validators.required, Validators.minLength(3)]),
    educational_establishment_contact_phone: new FormControl<string>(this.data.initial.educational_establishment_contact_phone, [Validators.required]),
  });

  ngOnInit() {
    if (this.data.initial) {
      let a = this.data.initial.educational_establishment_contact_phone
      let b = a.replace('+375', '')
      this.mainForm.patchValue({educational_establishment_contact_phone: b})
    }
  }

  addCountryCode(phoneNumber: string): string {
    const countryCode = "+375";

    if (!phoneNumber.startsWith(countryCode)) {
      return countryCode + phoneNumber;
    }

    return phoneNumber;
  }

  onSubmit() {
    if (!this.mainForm.valid) {
      return;
    }
    this.mainForm.value.educational_establishment_contact_phone = this.addCountryCode(this.mainForm.value.educational_establishment_contact_phone!)
    const event: SubmitEvent<any> = {
      value: this.mainForm.value, valid: this.mainForm.valid, errors: this.mainForm.errors,
    };

    const out = {
      value: event.value
    }

    this.dialogRef.close(out)
  }
}
