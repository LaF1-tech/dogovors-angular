import {Component, inject} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {FooterComponent} from "../../components/footer/footer.component";
import {FormBuilderComponent, FormConfig} from "@likdan/form-builder-core";
import {Buttons, Controls} from "@likdan/form-builder-material";
import {Validators} from "@angular/forms";
import {take} from "rxjs";
import {Router} from '@angular/router';
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    FormBuilderComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private router = inject(Router)
  private userService = inject(UserService)

  form = <FormConfig<any>>{
    controls: {
      username: {
        label: "Имя пользователя",
        type: Controls.textInput,
        validators: [Validators.required, Validators.minLength(3)],
      },
      password: {
        label: "Пароль",
        type: Controls.textInput,
        additionalFields: {
          type: "password"
        },
        validators: [Validators.required, Validators.minLength(4)],
      },
    },
    submit: {
      button: Buttons.Submit.Flat,
      buttonText: "Войти",
      onSubmit: (user) => this.userService.signIn(user.value)
        .pipe(take(1))
        .subscribe(()=>{
          alert('Успешно вошел')
          this.router.navigate(['/admin'])
      })
    }
  }
}
