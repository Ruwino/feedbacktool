import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Subject} from "../models/Subject";

@Injectable({
  providedIn: 'root'
})
export class SubjectService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  /**
   * @Author Stijn Prent
   * @Description Fetch subjects
   * @returns Observable<Subject[]>
   */
  public getAllSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.url}/teacher/subjects/all`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching subjects:', error);
        return of([]);
      })
    );
  }

  public getSubjects(): Observable<Subject[]> {
    return this.http.get<Subject[]>(`${this.url}/teacher/subjects`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching subjects:', error);
        return of([]);
      })
    );
  }
}
