import {inject, Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient)

  getUser(): Observable<User> {
    return this.http.get<User>("/api/v1/users")
  }

  createUser(user: any) {
    return this.http.post("/api/v1/users/signup", {
      username: user.username.toLowerCase(),
      password: user.password,
      first_name: user.first_name,
      last_name: user.last_name,
      permissions: ["Admin"],

    })
  }

  signIn(user: any) {
    return this.http.post("/api/v1/users/login", {
      username: user.username.toLowerCase(),
      password: user.password,
    })
  }

  editUserPassword(password: string, id: number) {
    return this.http.patch("/api/v1/users", {
      user_id: id,
      password: password
    })
  }
}
