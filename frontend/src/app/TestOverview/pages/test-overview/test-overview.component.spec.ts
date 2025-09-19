import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TestOverviewComponent } from './test-overview.component';
import { TestOverviewService } from '../../services/test-overview.service';
import { TestModel } from '../../models/testModel';
import { SubjectModel } from '../../models/subjectModel';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


describe('TestOverviewComponent', () => {

  let fixture: ComponentFixture<TestOverviewComponent>;
  let testOverviewService: TestOverviewService;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, TestOverviewComponent],
      providers: [TestOverviewService, TestOverviewService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: (key: string) => 'testId' } },
            params: of({ id: 'testId' }),
          },
        },],
    }).compileComponents();

  }));


  beforeEach(() => {
    testOverviewService = TestBed.inject(TestOverviewService);
    fixture = TestBed.createComponent(TestOverviewComponent);
  })

  it('should display an error if there are no subjects found.', () => {
    spyOn(testOverviewService, 'getSubjects').and.returnValue(of([]));

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.nativeElement.querySelector('.error-message.no-subjects');
    expect(errorMessage.textContent).toContain('Geen vakken gevonden.');
  });


  it('should return an error if there are no tests found.', () => {


    spyOn(testOverviewService, 'getSubjects').and.returnValue(of([
      new SubjectModel(1, 'Biologie', []),
      new SubjectModel(2, 'Wiskunde', []),
      new SubjectModel(3, 'Nederlands', []),
    ]));

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.nativeElement.querySelector('.error-message.no-tests');
    expect(errorMessage.innerHTML).toBe("Geen toetsen beschikbaar.");

  });


  it('should still return an error if there are no tests found for just one subject.', () => {


    spyOn(testOverviewService, 'getSubjects').and.returnValue(of([
      new SubjectModel(1, 'Biologie', [new TestModel(1, 'Biologie toets', '2021-06-01', 5,)]),
      new SubjectModel(2, 'Wiskunde', [new TestModel(1, 'Wiskunde toets', '2021-06-01', 5,)]),
      new SubjectModel(3, 'Nederlands', []),
    ]));

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.nativeElement.querySelector('.error-message.no-tests');
    expect(errorMessage.innerHTML).toBe("Geen toetsen beschikbaar.");

  });


  it('should return no error if there are tests found.', () => {


    spyOn(testOverviewService, 'getSubjects').and.returnValue(of([
      new SubjectModel(1, 'Biologie', [new TestModel(1, 'Biologie toets', '2021-06-01', 5,)]),
      new SubjectModel(2, 'Wiskunde', [new TestModel(1, 'Wiskunde toets', '2021-06-01', 5,)]),
      new SubjectModel(3, 'Nederlands', [new TestModel(1, 'Nederlands toets', '2021-06-01', 5,)]),
    ]));

    fixture.detectChanges();

    const errorMessage = fixture.debugElement.nativeElement.querySelector('.error-message.no-tests');
    expect(errorMessage).toBe(null);

  });



});
