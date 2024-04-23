import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {ControlTypeFactory, FormBuilderComponent, FormConfig} from "@likdan/form-builder-core";
import {Controls, Buttons} from "@likdan/form-builder-material";
import {Validators} from "@angular/forms";
import {HeaderComponent} from "./components/header/header.component";
import {FooterComponent} from "./components/footer/footer.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormBuilderComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  form = <FormConfig<any>>{
    controls: {
      educational_establishment_id: {
        label: "Учреждение образования",
        type: Controls.select,
        validators: [Validators.required],
      },
      specialization_id: {
        label: "Специальность",
        type: Controls.select,
        validators: [Validators.required],
      },
      last_name: {
        label: "Фамилия",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      name: {
        label: "Имя",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      middle_name: {
        label: "Отчество",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      phone_number: {
        label: "Номер телефона",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      date: {
        label: "Дата действия",
        type: Controls.dateRange,
        validators: [Validators.required],
      },
      types: {
        label: "Тип заявки",
        type: Controls.select,
        additionalFields: {
          multiple: true,
          items:["fllflf","fklflflf,","eiuhwfdsn","fdsoijf"]
        },
        validators: [Validators.required],
      }
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Подтвердить",
      onSubmit: console.log
    }
  }
}
