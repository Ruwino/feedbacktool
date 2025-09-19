import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Student } from '../models/Student';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  /**
   * @Author Stijn Prent
   * @Description Fetch students.
   * @returns Observable<Student[]>
   */
  public getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.url}/teacher/students/all`, this.httpOptions).pipe(
      catchError(error => {
        console.error('Error fetching students:', error);
        return of([]);
      })
    );
  }
}
