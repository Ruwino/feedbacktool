import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClassService } from './class.service';
import { Class } from '../models/Class';
import { environment } from '../../../environments/environment';
import {TestBed} from "@angular/core/testing";
import {Student} from "../models/Student";

describe('ClassService', () => {
  let service: ClassService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClassService]
    });
    service = TestBed.inject(ClassService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should add a class successfully', () => {
    const classData = new Class('Class 1', 1, 1, [new Student('johndoe@hva.nl','John', 'Doe')]);
    service.addClass(classData).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/class/add`);
    expect(req.request.method).toBe('POST');
    req.flush(null);
  });

  it('should handle error when adding a class', () => {
    const classData = new Class('Class 1', 1, 1, [new Student('johndoe@hva.nl','John', 'Doe')]);
    service.addClass(classData).subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/class/add`);
    expect(req.request.method).toBe('POST');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
