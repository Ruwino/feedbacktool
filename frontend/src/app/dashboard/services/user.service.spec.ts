import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {environment} from "../../../environments/environment";

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should return user role as Student', (done) => {
    const mockResponse = 'Student';

    service.getUserRole().subscribe((role) => {
      expect(role).toBe('Student');
      done();
    });

    const req = httpMock.expectOne(`${environment.domain}/user/role`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });
});
