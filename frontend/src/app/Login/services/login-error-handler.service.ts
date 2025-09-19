import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginErrorHandlerService {

  public handleLoginError(error: HttpErrorResponse): Observable<never>  {
    let errorMessage = 'An unknown error occurred!';

    if (error.status === 400) {
      errorMessage = 'Invalid credentials.';
    } else if (error.status === 401) {
      errorMessage = 'Unauthorized.';
    } else if (error.status === 404) {
      errorMessage = 'User not found. Please try again.';
    } else if (error.status === 500) {
      errorMessage = 'Something went wrong! Contact support.';
    } else if (error.status === 0) {
      errorMessage = 'Connection refused, check your network or try again later.';
    }


    return throwError(() => new Error(errorMessage));
  }
}
