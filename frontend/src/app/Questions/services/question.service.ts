import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { QuestionModel } from '../models/QuestionModel';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  private url = `${environment.domain}`;

  constructor(private http: HttpClient) {}

  public getQuestions(testId: number): Observable<QuestionModel[]> {
    return this.http
      .get<any>(`${this.url}/user/test/${testId}/questions`, { withCredentials: true })
      .pipe(
        map((response) => {
          return response.map((question: any) =>
            new QuestionModel(
              question.id,
              question.question,
              question.type,
              question.answers,
              question.learningObjectives
            )
          );
        })
      );
  }

  public answerQuestion(questionId: number,testId: number, answer: string): Observable<any> {
    return this.http.post<any>(`${this.url}/user/test/${testId}/question/${questionId}`, {
      answer: answer
    }, { withCredentials: true });
  }

  public hasCompletedTest(testId: number): Observable<boolean> {
    return this.http.get<any>(`${this.url}/user/test/${testId}/finished`, { withCredentials: true });
  }

  public getTestData(testId: number): Observable<any> {
    return this.http.get<any>(`${this.url}/user/test/${testId}/getInfo`, { withCredentials: true });
  }
}
 