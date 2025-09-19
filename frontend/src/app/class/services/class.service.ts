import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Class } from '../models/Class';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Student } from '../models/Student';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  /**
   * @Author Stijn Prent
   * @Description add a class
   * @returns Observable<void>
   * @param classData
   */
  public addClass(classData: Class): Observable<void> {
    return this.http
      .post<void>(
        `${this.url}/teacher/class/add`,
        classData.toJSON(),
        this.httpOptions
      )
      .pipe(
        catchError((error) => {
          console.error('Error adding class:', error);
          return of();
        })
      );
  }
  /**
   * @author Rowin Schoon
   * @description Haalt alle klassen op voor de ingelogde gebruiker
   * @returns Observable<Class[]>
   */
  public getClasses(): Observable<Class[]> {
    return this.http
      .get<Class[]>(`${this.url}/teacher/class/getall`, this.httpOptions)
      .pipe(
        map((classData) =>
          classData.map(
            (cls) =>
              new Class(
                cls.name,
                cls.gradeYear,
                cls.subjectId,
                cls.students.map(
                  (student) =>
                    new Student(
                      student.email,
                      student.firstName,
                      student.lastName
                    )
                ),
                cls.id
              )
          )
        ),
        catchError((error) => {
          console.error('Error fetching classes:', error);
          return throwError(error);
        })
      );
  }

  public getClassById(id: number): Observable<Class> {
    return this.http
      .get<Class>(`${this.url}/teacher/class/${id}`, this.httpOptions)
      .pipe(
        map(
          (cls) =>
            new Class(
              cls.name,
              cls.gradeYear,
              cls.subjectId,
              cls.students.map(
                (student) =>
                  new Student(
                    student.email,
                    student.firstName,
                    student.lastName
                  )
              ),
              cls.id
            )
        ),
        catchError((error) => {
          console.error(`Error fetching class ${id}:`, error);
          return throwError(error);
        })
      );
  }

  /**
   * @author Rowin Schoon
   * @description Converteert klassen naar dropdown opties
   * @returns Observable<{label: string, value: number}[]>
   */
  public getClassesAsDropdownOptions(): Observable<
    { label: string; value: number }[]
  > {
    return this.getClasses().pipe(
      map((classes) =>
        classes.map((cls) => ({
          label: `Leerjaar ${cls.gradeYear} - ${cls.name}`,
          value: cls.id || 0,
        }))
      )
    );
  }
}
