import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SubjectModel } from '../../../TestOverview/models/subjectModel';
import { StatCard } from '../../components/models/stat-card';
import { Class } from '../../../class/models/Class';
import { TestsService } from '../../services/tests.service';
import { StatsService } from '../../services/stats.service';
import { ClassService } from '../../services/class.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api'
import {UserRole} from "../../../navbar/enums/userRoles";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let testService: jasmine.SpyObj<TestsService>;
  let statService: jasmine.SpyObj<StatsService>;
  let classService: jasmine.SpyObj<ClassService>;
  let userService: jasmine.SpyObj<UserService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    // Create spy objects for each service with the needed methods
    const testServiceSpy = jasmine.createSpyObj('TestsService', ['getRecommendedTests', 'getTests']);
    const statServiceSpy = jasmine.createSpyObj('StatsService', [
      'getMadeTestsStats',
      'getBestObjective',
      'getStreakStats',
      'getClassAverageScore',
      'getClassWorstObjective',
      'getClassTotalTests'
    ]);
    const classServiceSpy = jasmine.createSpyObj('ClassService', ['getClasses']);
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    userServiceSpy.getUserRole.and.returnValue(of('Teacher'));
    testServiceSpy.getRecommendedTests.and.returnValue(of(new SubjectModel(1, 'Wiskunde', [])));
    testServiceSpy.getTests.and.returnValue(of([])); // Mock implementation for getTests
    statServiceSpy.getMadeTestsStats.and.returnValue(of(new StatCard('Tests Made', '0', '0', '', 'fa-chart', 'icon-color-green')));
    statServiceSpy.getBestObjective.and.returnValue(of(new StatCard('Best Objective', '', '', '', 'fa-chart', 'icon-color-green')));
    statServiceSpy.getStreakStats.and.returnValue(of(new StatCard('Streak', '', '', '', 'fa-chart', 'icon-color-green')));
    statServiceSpy.getClassAverageScore.and.returnValue(of(new StatCard('Average Score', '', '', '', 'fa-chart', 'icon-color-green')));
    statServiceSpy.getClassWorstObjective.and.returnValue(of(new StatCard('Worst Objective', '', '', '', 'fa-chart', 'icon-color-green')));
    statServiceSpy.getClassTotalTests.and.returnValue(of(new StatCard('Total Tests', '', '', '', 'fa-chart', 'icon-color-green')));
    classServiceSpy.getClasses.and.returnValue(of([new Class('Class A', 1, 1, [], 1)]));

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, DashboardComponent],
      providers: [
        { provide: TestsService, useValue: testServiceSpy },
        { provide: StatsService, useValue: statServiceSpy },
        { provide: ClassService, useValue: classServiceSpy },
        { provide: UserService, useValue: userServiceSpy },
        { provide: Router, useValue: routerSpy },
        MessageService,
        ConfirmationService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    testService = TestBed.inject(TestsService) as jasmine.SpyObj<TestsService>;
    statService = TestBed.inject(StatsService) as jasmine.SpyObj<StatsService>;
    classService = TestBed.inject(ClassService) as jasmine.SpyObj<ClassService>;
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user role and set isStudent to true if role is Student', (done) => {
    userService.getUserRole.and.returnValue(of(UserRole.Student));

    component.fetchUserRole();

    expect(component.isStudent).toBeTrue();
    done();
  });

  it('should fetch recommended tests and stats for student', (done) => {
    const mockMadeTestsStats: StatCard = new StatCard('Gemaakte toetsen', '12', '5', 'deze week', 'fa-chart', 'icon-color-green');
    const mockBestObjective: StatCard = new StatCard('Beste leerdoel', 'Wiskunde', '', '', 'fa-chart', 'icon-color-green');
    const mockStreakStats: StatCard = new StatCard('Streak', '3', '5', 'hoogste streak', 'fa-chart', 'icon-color-green');

    statService.getMadeTestsStats.and.returnValue(of(mockMadeTestsStats));
    statService.getBestObjective.and.returnValue(of(mockBestObjective));
    statService.getStreakStats.and.returnValue(of(mockStreakStats));

    component.fetchStatsStudent();

    expect(component.madeTestsStats).toEqual(mockMadeTestsStats);
    expect(component.bestObjective).toEqual(mockBestObjective);
    expect(component.streakStats).toEqual(mockStreakStats);
    done();
  });

  it('should fetch classes and set selected class and students', (done) => {
    const mockClasses: Class[] = [
      new Class('2A', 2, 1, [], 1),
      new Class('2C', 2, 2, [], 2)
    ];

    classService.getClasses.and.returnValue(of(mockClasses));

    component.fetchClasses(0);

    expect(component.classes).toEqual(mockClasses);
    expect(component.selectedClass).toEqual(mockClasses[0]);
    expect(component.students).toEqual(mockClasses[0].students);
    done();
  });

  it('should fetch stats for teacher when class is selected', (done) => {
    const mockClass: Class = new Class('2A', 2, 1, [], 1);
    const mockAverageScore: StatCard = new StatCard('Gemiddelde van de klas', '7.5', '', '', 'fa-chart', 'icon-color-green');
    const mockWorstObjective: StatCard = new StatCard('Slechste leerdoel', 'Wiskunde', '', '', 'fa-chart', 'icon-color-green');
    const mockTotalTests: StatCard = new StatCard('Gemaakte toetsen', '12', '', 'per week', 'fa-chart', 'icon-color-green');

    component.selectedClass = mockClass;

    statService.getClassAverageScore.and.returnValue(of(mockAverageScore));
    statService.getClassWorstObjective.and.returnValue(of(mockWorstObjective));
    statService.getClassTotalTests.and.returnValue(of(mockTotalTests));

    component.fetchStatsTeacher();

    expect(component.averageScoreStats).toEqual(mockAverageScore);
    expect(component.worstObjectiveStats).toEqual(mockWorstObjective);
    expect(component.totalTestsStats).toEqual(mockTotalTests);
    done();
  });

  it('should navigate to create test page', () => {
    component.createTest();
    expect(router.navigate).toHaveBeenCalledWith(['/test/create']);
  });

  it('should navigate to create class page', () => {
    component.createClass();
    expect(router.navigate).toHaveBeenCalledWith(['/class/add']);
  });
});
