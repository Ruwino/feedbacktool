import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, of} from "rxjs";
import {Class} from "../../class/models/Class";
import {Student} from "../../class/models/Student";

@Injectable({
  providedIn: 'root'
})
export class ClassService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  public getClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.url}/teacher/class/getAll`, this.httpOptions)
  }

  public addStudentsToClass(classId: number, students: Student[]): Observable<unknown> {
    const payload = {
      classId: classId,
      students: students
    }
    return this.http.post(`${this.url}/teacher/class/addStudents`, payload, this.httpOptions)
  }

  public removeStudentFromClass(classId: number, studentEmail: string): Observable<unknown> {
    const payload = {
      classId: classId,
      studentEmail: studentEmail
    }
    return this.http.post(`${this.url}/teacher/class/removeStudent`, payload, this.httpOptions)
  }
}
