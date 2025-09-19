import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import {UserRole} from "../../navbar/enums/userRoles";


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  public getUserRole(): Observable<UserRole> {
    return this.http.get<string>(`${this.url}/user/role`, this.httpOptions)
      .pipe(
        map((role: string) => {
          // Convert the string response to UserRole enum
          return role as UserRole;
        })
      );
  }
}
