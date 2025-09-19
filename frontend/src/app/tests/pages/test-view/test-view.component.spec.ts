import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TestViewComponent } from './test-view.component';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TestModel } from '../../models/test.model';
import { createValidTestModel } from '../../util/tests.util';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MessageService } from 'primeng/api';
import { RouterTestingModule } from '@angular/router/testing';

describe('TestViewComponent', () => {
  let component: TestViewComponent;
  let fixture: ComponentFixture<TestViewComponent>;
  let testService: TestService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TestViewComponent,
        HttpClientTestingModule
      ],
      providers: [
        TestService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        Router,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestViewComponent);
    component = fixture.componentInstance;

    testService = TestBed.inject(TestService);
    router = TestBed.inject(Router);
  });

  it('should fetch and display test data correctly', () => {
    const mockTest: TestModel = createValidTestModel();

    const spy = spyOn(testService, 'getTest').and.returnValue(of(mockTest));

    fixture.detectChanges();

    expect(spy).toHaveBeenCalled();
    expect(component.testModel).toEqual(mockTest);
  });

  it('should navigate to 404 error page if test not found', fakeAsync(() => {
    const errorResponse = { status: 404 };

    spyOn(testService, 'getTest').and.returnValue(throwError(() => errorResponse));

    const spy = spyOn(router, 'navigate');

    fixture.detectChanges();

    tick();

    expect(spy).toHaveBeenCalledWith(['/request-error/404'], { replaceUrl: true });
  }));

  it('should navigate to 500 error page if server error occurs', fakeAsync(() => {
    const errorResponse = { status: 500 };

    spyOn(testService, 'getTest').and.returnValue(throwError(() => errorResponse));

    const spy = spyOn(router, 'navigate');

    fixture.detectChanges();

    tick();

    expect(spy).toHaveBeenCalledWith(['/request-error/500'], { replaceUrl: true });
  }));

  it('should show edit button to authorized user', () => {
    const mockTest: TestModel = createValidTestModel();
    mockTest.id = 1;
    mockTest.canEdit = true;
  
    spyOn(testService, 'getTest').and.returnValue(of(mockTest));
  
    fixture.detectChanges();
  
    const buttons = fixture.nativeElement.querySelectorAll('button');

    fixture.detectChanges();

    const editButton = Array.from(buttons).find(
      (btn: any) => btn.textContent?.trim() === 'Bewerk'
    );
  
    expect(editButton).toBeTruthy(); // Button with label 'Bewerk' should be found
  });

  it('should not show edit button to an unauthorized user', () => {
    const mockTest: TestModel = createValidTestModel();
    mockTest.id = 1;
    mockTest.canEdit = false;
  
    spyOn(testService, 'getTest').and.returnValue(of(mockTest));
  
    fixture.detectChanges();
  
    const buttons = fixture.nativeElement.querySelectorAll('button');
    const editButton = Array.from(buttons).find(
      (btn: any) => btn.textContent?.trim() === 'Bewerk'
    );
  
    expect(editButton).toBeUndefined(); // No button with label 'Bewerk' should be found
  });
});
