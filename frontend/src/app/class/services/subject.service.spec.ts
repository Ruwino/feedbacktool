import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SubjectService } from './subject.service';
import { Subject } from '../models/Subject';
import { environment } from '../../../environments/environment';
import {TestBed} from "@angular/core/testing";

describe('SubjectService', () => {
  let service: SubjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SubjectService]
    });
    service = TestBed.inject(SubjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch subjects successfully', () => {
    const subjects: Subject[] = [new Subject(1, 'Math')];
    service.getAllSubjects().subscribe(response => {
      expect(response).toEqual(subjects);
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/subjects/all`);
    expect(req.request.method).toBe('GET');
    req.flush(subjects);
  });

  it('should handle error when fetching subjects', () => {
    service.getAllSubjects().subscribe(response => {
      expect(response).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.domain}/teacher/subjects/all`);
    expect(req.request.method).toBe('GET');
    req.flush('Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
