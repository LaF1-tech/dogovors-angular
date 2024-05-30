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
    return this.http.get<User>("/api/v1/users/")
  }

  editUserPassword(password: string, id: number) {
    return this.http.patch("/api/v1/users/", {
      user_id: id,
      password: password
    })
  }
}
