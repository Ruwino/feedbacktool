import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Student } from '../../models/student.model';
import { ClassService } from '../../../class/services/class.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StudentListService {
  private readonly httpOptions: object = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    withCredentials: true,
  };
  private url = environment.domain;

  private studentsSubject = new BehaviorSubject<Student[]>([]);
  public students$ = this.studentsSubject.asObservable();

  constructor(private http: HttpClient, private classService: ClassService) {}

  loadStudentsFromClass(classId: number): void {
    if (!classId) {
      this.studentsSubject.next([]);
      return;
    }

    this.classService
      .getClassById(classId)
      .pipe(
        switchMap((classData) => {

          // Filter docenten (emails met "teacher@") uit de lijst
          const studentsOnly = classData.students.filter((student) => {
            // Controleer of het email beschikbaar is en of het geen docent email is
            return student.email && !student.email.includes('teacher@');
          });

          // Voor elke student, haal de laatste toetsgegevens op
          if (studentsOnly.length === 0) {
            return of([]); // Geen studenten, return lege array
          }

          const studentEmails = studentsOnly.map((student) => student.email);

          // Haal de laatste toetsgegevens op voor alle studenten
          return this.getLatestGradesForStudents(studentEmails).pipe(
            map((gradesMap) => {
              // Combineer student data met toetsgegevens
              return studentsOnly.map((student) => {
                // Check of er cijfers zijn voor deze student
                const latestGrade = gradesMap[student.email];

                if (!latestGrade) {
                  // Geen cijfers gevonden, gebruik standaard waardes
                  return {
                    name: `${student.firstName} ${student.lastName}`,
                    email: student.email,
                    testName: 'Geen resultaten', // Duidelijke test naam
                    goal: 'Geen toets gemaakt',
                    score: 0,
                    date: 'N/A',
                  };
                }

                return {
                  name: `${student.firstName} ${student.lastName}`,
                  email: student.email,
                  testName: latestGrade.testName || 'Onbekende toets',
                  goal:
                    latestGrade.learningObjective || 'Geen specifiek leerdoel',
                  score: latestGrade.scorePercentage,
                  date: latestGrade.testDate
                    ? new Date(latestGrade.testDate).toLocaleDateString()
                    : 'Niet gemaakt',
                };
              });
            })
          );
        })
      )
      .subscribe({
        next: (enrichedStudents) => {
          // Verwijder eventuele duplicaten op basis van email
          const uniqueStudents = Array.from(
            new Map(enrichedStudents.map((s) => [s.email, s])).values()
          );

          this.studentsSubject.next(uniqueStudents);
        },
        error: (err) => {
          console.error('Error loading students with grades:', err);
          this.studentsSubject.next([]);
        },
      });
  }

  /**
   * Haalt de meest recente toetsgegevens op voor een lijst van studenten
   * @param studentEmails Array van student emails
   * @returns Een map van student email naar hun laatste toetsgegevens
   */
  private getLatestGradesForStudents(
    studentEmails: string[]
  ): Observable<{ [email: string]: any }> {
    return this.http
      .post<any>(
        `${this.url}/teacher/student/latest-grades`,
        { studentEmails },
        this.httpOptions
      )
      .pipe(
        map((response) => {
          // Transformeer de array tot een map met email als sleutel
          const gradesMap: { [email: string]: any } = {};
          response.forEach((item: any) => {
            gradesMap[item.studentEmail] = {
              testName: item.testName,
              learningObjective:
                item.learningObjectives?.[0] || 'Geen specifiek leerdoel',
              scorePercentage: item.scorePercentage,
              testDate: item.testDate,
            };
          });
          return gradesMap;
        }),
        catchError((error) => {
          console.error('Error fetching latest grades:', error);
          return of({});
        })
      );
  }

  // Methode om detailgegevens van een student op te halen
  getStudentByEmail(email: string): Observable<Student> {
    return this.http.get<Student>(
      `${this.url}/students/${email}`,
      this.httpOptions
    );
  }
}

// Interfaces buiten de klasse
interface ClassData {
  students: ClassStudent[];
}

interface ClassStudent {
  firstName: string;
  lastName: string;
  email: string;
}
