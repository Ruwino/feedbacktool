import { TestBed } from '@angular/core/testing';
import { StudentListService } from './student-list.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClassService } from '../../../class/services/class.service';
import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
// Correct importpad voor Class en Student
import { Class } from '../../../class/models/Class';
import { Student } from '../../../class/models/Student';

describe('StudentListService', () => {
  let service: StudentListService;
  let httpMock: HttpTestingController;
  let classServiceMock: jasmine.SpyObj<ClassService>;

  beforeEach(() => {
    const classSpy = jasmine.createSpyObj('ClassService', ['getClassById']);
    
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        StudentListService,
        { provide: ClassService, useValue: classSpy }
      ]
    });
    
    service = TestBed.inject(StudentListService);
    httpMock = TestBed.inject(HttpTestingController);
    classServiceMock = TestBed.inject(ClassService) as jasmine.SpyObj<ClassService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load students from class with grades', (done) => {
    // Maak studenten volgens het juiste model
    const students: Student[] = [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com' } as Student,
      { firstName: 'Jane', lastName: 'Smith', email: 'jane@example.com' } as Student
    ];
    
    // Maak de Class met de juiste constructor volgorde
    const mockClass = new Class(
      'Test Class',     // name
      2025,             // gradeYear
      1,                // subjectId
      students,         // students array
      1                 // id (optional)
    );
    
    const mockGradesResponse = [
      { 
        studentEmail: 'john@example.com',
        testName: 'Wiskunde Gevorderd',
        subjectName: 'Wiskunde',
        scorePercentage: 85,
        learningObjectives: ['Begrijp de basisbewerkingen'],
        testDate: '2025-03-30T10:00:00Z'
      }
    ];

    // Set up de mock
    classServiceMock.getClassById.and.returnValue(of(mockClass));

    service.students$.subscribe(students => {
      if (students.length > 0) {
        expect(students.length).toBe(2);
        expect(students[0].name).toContain('John');
        expect(students[0].testName).toBe('Wiskunde Gevorderd');
        expect(students[0].goal).toBe('Begrijp de basisbewerkingen');
        expect(students[0].score).toBe(85);
        done();
      }
    });

    service.loadStudentsFromClass(1);

    const req = httpMock.expectOne(`${environment.domain}/teacher/student/latest-grades`);
    expect(req.request.method).toBe('POST');
    req.flush(mockGradesResponse);
  });

  // Tweede test met dezelfde aanpassingen
  it('should handle student with no grades', (done) => {
    const students: Student[] = [
      { firstName: 'No', lastName: 'Grades', email: 'no-grades@example.com' } as Student
    ];
    
    const mockClass = new Class(
      'Empty Class',
      2025,
      1,
      students,
      1
    );
    
    const mockGradesResponse: any[] = [];

    classServiceMock.getClassById.and.returnValue(of(mockClass));

    service.students$.subscribe(students => {
      if (students.length > 0) {
        expect(students.length).toBe(1);
        expect(students[0].name).toBe('No Grades');
        expect(students[0].testName).toBe('Geen resultaten');
        expect(students[0].goal).toBe('Geen toets gemaakt');
        expect(students[0].score).toBe(0);
        done();
      }
    });

    service.loadStudentsFromClass(1);

    const req = httpMock.expectOne(`${environment.domain}/teacher/student/latest-grades`);
    expect(req.request.method).toBe('POST');
    req.flush(mockGradesResponse);
  });
});