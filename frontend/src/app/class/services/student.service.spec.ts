import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models/Student';
import { environment } from '../../../environments/environment';
import {TestBed} from "@angular/core/testing";

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch students successfully', () => {
    const students: Student[] = [new Student('johndoe@hva.nl', 'John', 'Doe')];
    service.getStudents().subscribe(response => {
      expect(response).toEqual(students);
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/students/all`);
    expect(req.request.method).toBe('GET');
    req.flush(students);
  });

  it('should handle error when fetching students', () => {
    service.getStudents().subscribe(response => {
      expect(response).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/students/all`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
