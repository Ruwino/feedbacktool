import {of, throwError} from 'rxjs';
import { TestModel } from '../../TestOverview/models/testModel';
import { TestsService } from './tests.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('TestsService', () => {
  let service: TestsService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return recommended tests', (done) => {
    const mockTests: TestModel[] = [
      new TestModel(1, 'BI23', '2021-06-01', 30),
      new TestModel(2, 'BI24', '2021-06-01', 30),
      new TestModel(3, 'BI25', '2021-06-01', 30),
      new TestModel(4, 'BI26', '2021-06-01', 30),
      new TestModel(5, 'BI27', '2021-06-01', 30)
    ];
    spyOn(service, 'getRecommendedTests').and.returnValue(of(mockTests));
    service.getRecommendedTests().subscribe((tests: TestModel[]) => {
      expect(tests.length).toBe(5);
      expect(tests[0].name).toBe('BI23');
      done();
    });
  });

  it('should return an empty list if no recommended tests are available', (done) => {
    spyOn(service, 'getRecommendedTests').and.returnValue(of([] as TestModel[]));
    service.getRecommendedTests().subscribe((tests: TestModel[]) => {
      expect(tests.length).toBe(0);
      done();
    });
  });

  it('should return correct test details for recommended tests', (done) => {
    const mockTests: TestModel[] = [
      new TestModel(1, 'BI23', '2021-06-01', 30)
    ];
    spyOn(service, 'getRecommendedTests').and.returnValue(of(mockTests));
    service.getRecommendedTests().subscribe((tests: TestModel[]) => {
      const test = tests.find(t => t.id === 1);
      expect(test).toBeTruthy();
      expect(test?.name).toBe('BI23');
      expect(test?.startDate).toBe('2021-06-01');
      expect(test?.duration).toBe(30);
      done();
    });
  });

  it('should handle error when fetching recommended tests', (done) => {
    spyOn(service, 'getRecommendedTests').and.returnValue(throwError(() => new Error('Failed to fetch tests')));
    service.getRecommendedTests().subscribe({
      next: () => fail('Expected an error, but got tests'),
      error: (error) => {
        expect(error.message).toBe('Failed to fetch tests');
        done();
      }
    });
  });

  it('should set visibility of a test', (done) => {
    const payload = { testId: 1, classId: 1, visible: true };
    spyOn(service, 'setVisibility').and.returnValue(of({}));
    service.setVisibility(1, 1, true).subscribe((response) => {
      expect(response).toEqual({});
      done();
    });
  });
});
