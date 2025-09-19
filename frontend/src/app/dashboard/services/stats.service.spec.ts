import { of } from 'rxjs';
import { StatCard } from '../components/models/stat-card';
import { StatsService } from './stats.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('StatsService', () => {
  let service: StatsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(StatsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return made tests stats', (done) => {
    const mockResponse = { allTests: 4, currentWeek: 1 };
    service.getMadeTestsStats().subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Gemaakte toetsen');
      expect(stat.stat).toBe('4');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/student/stat/madeTests`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return streak stats', (done) => {
    const mockResponse = { currentStreak: 5, longestStreak: 10 };
    service.getStreakStats().subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Streak');
      expect(stat.stat).toBe('5 Dagen');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/student/stat/streak`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return best objective', (done) => {
    const mockResponse = 'vermenigvuldigen';
    service.getBestObjective().subscribe((objective: StatCard) => {
      expect(objective.title).toBe('Beste leerdoel');
      expect(objective.stat).toBe('vermenigvuldigen');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/student/stat/bestObjective`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return class average score', (done) => {
    const mockResponse = 7.5;
    service.getClassAverageScore(1).subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Gemiddelde score');
      expect(stat.stat).toBe('7.5%');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/teacher/stats/class/average/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return class worst objective', (done) => {
    const mockResponse = 'Wiskunde';
    service.getClassWorstObjective(1).subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Slechtste leerdoel');
      expect(stat.stat).toBe('Wiskunde');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/teacher/stats/class/worstObjective/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return class total tests', (done) => {
    const mockResponse = 10;
    service.getClassTotalTests(1).subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Totaal aantal toetsen gemaakt');
      expect(stat.stat).toBe('10');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/teacher/stats/class/totalTests/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return "Niks gevonden" for non-existent class worst objective', (done) => {
    service.getClassWorstObjective(999).subscribe((stat: StatCard) => {
      expect(stat.title).toBe('Slechtste leerdoel');
      done();
    });

    const req = httpMock.expectOne(`${service['url']}/teacher/stats/class/worstObjective/999`);
    expect(req.request.method).toBe('GET');
    req.flush(null);
  });
});
