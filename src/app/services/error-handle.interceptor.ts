import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http'
import {catchError, throwError} from "rxjs"
import {inject} from "@angular/core";
import {MatSnackBar} from "@angular/material/snack-bar";

export const errorHandleInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar)
  return next(req).pipe(
    catchError((err: any) => {
      return throwError(() => snackBar.open(err.error.error, 'ok!', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      }))
    })
  )
}
