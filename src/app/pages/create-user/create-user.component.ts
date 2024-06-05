import {Component, inject} from '@angular/core';
import {FooterComponent} from "../../components/footer/footer.component";
import {FormBuilderComponent, FormConfig} from "@likdan/form-builder-core";
import {HeaderComponent} from "../../components/header/header.component";
import {Buttons, Controls} from "@likdan/form-builder-material";
import {Validators} from "@angular/forms";
import {take} from "rxjs";
import {UserService} from "../../services/user.service";

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
  private userService = inject(UserService)

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
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Создать",
      onSubmit: (user) => this.userService.createUser(user.value).pipe(take(1)).subscribe(() => {
        alert("Пользователь создан!")
        window.location.reload();
      })
    }
  }
}
