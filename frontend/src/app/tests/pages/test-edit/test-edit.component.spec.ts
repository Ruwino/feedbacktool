import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { TestEditComponent } from './test-edit.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TestService } from '../../services/test.service';
import { TestCreationComponent } from '../test-creation/test-creation.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TestModel } from '../../models/test.model';
import { createValidTestModel } from '../../util/tests.util';
import { TestFormSubmitEvent } from '../../elements/test-form/test-form.component';

describe('TestEditComponent', () => {
  let component: TestEditComponent;
  let fixture: ComponentFixture<TestEditComponent>;
  let testService: TestService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreationComponent, HttpClientTestingModule],
      providers: [
        TestService,
        Router,
        MessageService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestEditComponent);
    component = fixture.componentInstance;

    testService = TestBed.inject(TestService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);

    spyOn(messageService, 'add');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to 401 error page if user can not edit test', fakeAsync(() => {
    const mockTest: TestModel = createValidTestModel();
    mockTest.canEdit = false;

    spyOn(testService, 'getTest').and.returnValue(of(mockTest));

    const spy = spyOn(router, 'navigate');

    fixture.detectChanges();

    tick();

    expect(spy).toHaveBeenCalledWith(['/request-error/401'], { replaceUrl: true });
  }));

  it('should call testService after submitting a valid test', fakeAsync(() => {
    const mockTest: TestModel = createValidTestModel();
    mockTest.canEdit = true;

    const event: TestFormSubmitEvent = {
      testModel: mockTest,
      messageService: messageService,
      disableInput: jasmine.createSpy('disableInput'),
      enableInput: jasmine.createSpy('enableInput')
    };

    spyOn(testService, 'editTest').and.returnValue(of());

    component.onSubmit(event);

    expect(testService.editTest).toHaveBeenCalledWith(mockTest);
  }));

  it('should show error message if onSubmit fails', fakeAsync(() => {
    const mockTest: TestModel = createValidTestModel();
    mockTest.canEdit = true;

    const event: TestFormSubmitEvent = {
      testModel: mockTest,
      messageService: messageService,
      disableInput: jasmine.createSpy('disableInput'),
      enableInput: jasmine.createSpy('enableInput')
    };

    spyOn(testService, 'editTest').and.returnValue(throwError(() => new Error('Test edit failed')));

    component.onSubmit(event);

    expect(testService.editTest).toHaveBeenCalledWith(mockTest);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Er is een fout opgetreden.'
    });
  }));
});
