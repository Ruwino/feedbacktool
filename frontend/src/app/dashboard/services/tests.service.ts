import { Injectable } from '@angular/core';
import {SubjectModel} from "../../TestOverview/models/subjectModel";
import {Observable, of} from "rxjs";
import {TestModel} from "../../TestOverview/models/testModel";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TestsService {

  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  constructor(private http: HttpClient) {}

  public getRecommendedTests(): Observable<TestModel[]> {
    return this.http.get<TestModel[]>(`${this.url}/student/stat/recommendedTests`, this.httpOptions);
  }

  public getTests(id: number): Observable<TestModel[]> {
    return this.http.get<TestModel[]>(`${this.url}/teacher/tests/class/${id}`, this.httpOptions);
  }

  public setVisibility(testId: number, classId: number, visible: boolean): Observable<unknown> {
    const payload = {
      testId: testId,
      classId: classId,
      visible: visible
    }
    return this.http.post(`${this.url}/teacher/test/visibility`, payload, this.httpOptions);
  }
}
