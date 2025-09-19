import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginErrorHandlerService } from './login-error-handler.service';
import { catchError, Observable } from 'rxjs';
import { LoginModel } from '../models/LoginModel';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private url = `${environment.domain}/login`;

  constructor(private http: HttpClient, private errorHandler: LoginErrorHandlerService) {}

  public login(loginData: LoginModel): Observable<unknown> {
    const payload = {
      email: loginData.email,
      password: loginData.password
    };

    return this.http.post<unknown>(this.url, payload, { withCredentials: true }).pipe(
      catchError(this.errorHandler.handleLoginError)
    );
  }
}
