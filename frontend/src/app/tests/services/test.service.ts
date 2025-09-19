import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TestModel } from '../models/test.model';
import { QuestionModel } from '../models/question.model';
import { QuestionType } from '../enums/questionType.enum';
import { AnswerModel } from '../models/answer.model';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  private baseUrl = `${environment.domain}/teacher/test`;

  constructor(private http: HttpClient) { }

  public createTest(test: TestModel): Observable<number> {
    console.log(test.toJSON());

    return this.http.post<number>(`${this.baseUrl}/create`, test.toJSON(), { withCredentials: true }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to create test. Please try again later.'));
      })
    );
  }

  public editTest(test: TestModel): Observable<unknown> {
    return this.http.put<unknown>(`${this.baseUrl}/edit`, test.toJSON(), { withCredentials: true }).pipe(
      catchError(() => {
        return throwError(() => new Error('Failed to edit test. Please try again later.'));
      })
    );
  }

  public getTest(testId: number): Observable<TestModel> {
    return this.http.get<TestModel>(`${this.baseUrl}/${testId}`, { withCredentials: true }).pipe(
      catchError((error: any) => {
        return throwError(() => error);
      })
    );
  }
}
