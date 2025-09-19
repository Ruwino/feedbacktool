import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Grade } from '../models/grade';
import { environment } from '../../../environments/environment';

// Eenvoudige interface voor de user data die we terugkrijgen
interface UserInfo {
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class GradeService {
  // Bestaande properties behouden voor bestaande code
  private apiUrl = `${environment.domain}/teacher/student/grades`;
  private studentApiUrl = `${environment.domain}/student/grades`;
  private selectedStudentId: string | null = null;
  private selectedStudentName: string | null = null;

  private readonly httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };

  constructor(private http: HttpClient) {}

  setSelectedStudent(studentId: string, studentName: string): void {
    console.log('Setting selected student:', studentId, studentName);
    this.selectedStudentId = studentId;
    this.selectedStudentName = studentName;
  }

  getSelectedStudentName(): string {
    return this.selectedStudentName || 'Onbekende student';
  }

  getGrades(): Observable<Grade[]> {
    if (!this.selectedStudentId) {
      console.warn('No student selected');
      return of([]);
    }

    console.log('Fetching grades for student:', this.selectedStudentId);
    console.log('Using HTTP options:', this.httpOptions);

    return this.http
      .post<any[]>(
        this.apiUrl,
        { studentEmail: this.selectedStudentId },
        this.httpOptions
      )
      .pipe(
        tap((response) => console.log('Fetched grades:', response)),
        map((response) => this.transformGradeResponse(response)),
        catchError((error) => {
          console.error('Error fetching grades', error);
          return of([]);
        })
      );
  }

  getMyGrades(): Observable<Grade[]> {
    return this.http.get<any[]>(this.studentApiUrl, this.httpOptions).pipe(
      tap((response) => console.log('Fetched my grades:', response)),
      map((response) => this.transformGradeResponse(response)),
      catchError((error) => {
        console.error('Error fetching my grades', error);
        return of([]);
      })
    );
  }

  private transformGradeResponse(response: any[]): Grade[] {
    if (!response || response.length === 0) {
      console.warn('Empty response or no grades found');
      return [];
    }

    return response.map(
      (item) =>
        new Grade(
          `${item.subjectName}, ${item.testName}`,
          `${parseFloat(item.scorePercentage).toFixed(2)}%`,
          item.scorePercentage,
          item.learningObjectives || []
        )
    );
  }
}
