import { TestBed, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';

import { TestOverviewService } from './test-overview.service';
import { SubjectModel } from '../models/subjectModel';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TestOverviewService', () => {
  let service: TestOverviewService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    }).compileComponents();

  }));


  beforeEach(() => {
    service = TestBed.inject(TestOverviewService);
  });

  it('should return an observable list', () => {

    expect(service.getSubjects()).toBeInstanceOf(Observable<SubjectModel[]>);

  });

});
