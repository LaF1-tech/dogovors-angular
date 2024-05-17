import {Component} from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {FormBuilderComponent, FormConfig, sendHttpRequestAndSubscribe} from "@likdan/form-builder-core";
import {HeaderComponent} from "../../components/header/header.component";
import {Buttons, Controls} from "@likdan/form-builder-material";
import {Validators} from "@angular/forms";

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [
    FooterComponent,
    FormBuilderComponent,
    HeaderComponent
  ],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss'
})
export class CreateUserComponent {
  form = <FormConfig<any>>{
    controls: {
      username: {
        label: "Имя пользователя",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      first_name: {
        label: "Имя",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      last_name: {
        label: "Фамилия",
        type: Controls.textInput,
        validators: [Validators.required],
      },
      password: {
        label: "Пароль",
        type: Controls.textInput,
        additionalFields: {
          type: "password"
        },
        validators: [Validators.required],
      },
      makeAdmin: {
        label: "Администратор",
        type: Controls.checkbox,
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Создать",
      onSubmit: sendHttpRequestAndSubscribe({
        url: "/api/v1/users/signup",
        method: "POST",
        sendOnInvalidValidation: false,
      })
    }
  }
}
