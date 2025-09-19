import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { SubjectModel } from '../models/subjectModel';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

/**
 * @author Latricha Seym
 * @description This service is responsible for fetching the tests from the backend.
 */
export class TestOverviewService {

  private url = environment.domain;

  constructor(private http: HttpClient) { }

  /**
   * @author Latricha Seym
   * @returns an array of subjects.
   * @description This method fetches the subjects from the backend.
   */
  public getSubjects(): Observable<SubjectModel[]> {

    return this.http.get<SubjectModel[]>(this.url + '/student/subjects/tests', { withCredentials: true }).pipe(catchError(error => {
      //This returns an empty array if there is an error. 
      console.log('Error fethching subjects:', error);
      return of([]);

    }))
  }
}
