import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Subject } from '../models/subject.model';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private url = environment.domain;
  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  public getSubjects(): Observable<Subject[]> {
    return this.http
      .get<Subject[]>(`${this.url}/subjects/all`, this.httpOptions)
      .pipe(
        catchError((error) => {
          console.error('Error fetching subjects:', error);
          return of([]);
        })
      );
  }

  public register(registerData: any): Observable<void> {
    // Verkrijg alleen de namen van de geselecteerde vakken
    const subjectNames = registerData.selectedSubjects.map(
      (subject: Subject) => subject.name
    );

    const formattedData = {
      firstName: registerData.firstName,
      lastName: registerData.lastName,
      email: registerData.email,
      password: registerData.password,
      registerCode: registerData.registerCode,
      subjects: subjectNames,
    };

    return this.http
      .post<void>(`${this.url}/register`, formattedData, this.httpOptions)
      .pipe(
        catchError((error) => {
          return throwError(() => new Error(error.error.message));
        })
      );
  }
}
