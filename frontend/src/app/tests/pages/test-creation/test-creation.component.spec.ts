import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestCreationComponent } from './test-creation.component';
import { MessageService } from 'primeng/api';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { TestService } from '../../services/test.service';
import { TestFormSubmitEvent } from '../../elements/test-form/test-form.component';
import { createValidTestModel } from '../../util/tests.util';
import { Router } from '@angular/router';

describe('TestCreationComponent', () => {
  let component: TestCreationComponent;
  let fixture: ComponentFixture<TestCreationComponent>;
  let testService: TestService;
  let router: Router;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestCreationComponent, HttpClientTestingModule],
      providers: [
        TestService,
        Router,
        MessageService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestCreationComponent);
    component = fixture.componentInstance;

    testService = TestBed.inject(TestService);
    router = TestBed.inject(Router);
    messageService = TestBed.inject(MessageService);

    spyOn(router, 'navigate');
    spyOn(messageService, 'add');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call service when the form is submitted successfully', () => {
    const testModel = createValidTestModel();
    const event: TestFormSubmitEvent = {
      testModel,
      messageService,
      disableInput: jasmine.createSpy('disableInput'),
      enableInput: jasmine.createSpy('enableInput')
    };

    spyOn(testService, 'createTest').and.returnValue(of(1));

    component.onSubmit(event);

    expect(testService.createTest).toHaveBeenCalledWith(testModel);
    expect(event.disableInput).toHaveBeenCalled();
  });

  it('should show an error message and call enableInput after one second if createTest fails', () => {
    const testModel = createValidTestModel();
    const event: TestFormSubmitEvent = {
      testModel,
      messageService,
      disableInput: jasmine.createSpy('disableInput'),
      enableInput: jasmine.createSpy('enableInput')
    };

    spyOn(testService, 'createTest').and.returnValue(throwError(() => new Error('Test creation failed')));

    component.onSubmit(event);

    expect(testService.createTest).toHaveBeenCalledWith(testModel);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Er is een fout opgetreden.'
    });
    expect(event.disableInput).toHaveBeenCalled();

    setTimeout(() => {
      expect(event.enableInput).toHaveBeenCalled();
    }, 1001);
  });
});
