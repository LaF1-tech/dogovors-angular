import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilderComponent, FormConfig, FormConfigControls} from "@likdan/form-builder-core";
import {Buttons} from "@likdan/form-builder-material";

export interface Data {
  template_id: number
  controls: FormConfigControls
}

@Component({
  selector: 'app-form-config-dialog',
  standalone: true,
  imports: [
    FormBuilderComponent
  ],
  templateUrl: './form-config-dialog.component.html',
  styleUrl: './form-config-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormConfigDialogComponent {
  data = inject<Data>(MAT_DIALOG_DATA)
  dialogRef = inject(MatDialogRef)

  config = <FormConfig<any>>{
    controls: this.data.controls,
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Подтвердить",
      onSubmit: e => {
        if (!e.valid) return

        const out = {
          template_id: this.data.template_id,
          value: e.value,
        }
        this.dialogRef.close(out)
      }
    }
  }
}
