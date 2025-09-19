import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestFormComponent } from './test-form.component';
import { QuestionType } from '../../enums/questionType.enum';
import { MessageService } from 'primeng/api';
import { FormArray } from '@angular/forms';
import { QuestionModel } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';
import { createValidTestModel } from '../../util/tests.util';
import { ObjectiveModel } from '../../models/objective.model';

describe('TestFormComponent', () => {
  let component: TestFormComponent;
  let fixture: ComponentFixture<TestFormComponent>;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestFormComponent],
      providers: [MessageService]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TestFormComponent);
    component = fixture.componentInstance;

    messageService = TestBed.inject(MessageService);

    spyOn(messageService, 'add');
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should initialize the form with default values', () => {
    const testModel = createValidTestModel()

    component.testModel = testModel;

    fixture.detectChanges();

    const nameControl = component.formControls.name;
    const subjectControl = component.formControls.subject;

    expect(nameControl.value).toBe(testModel.name || '');
    expect(subjectControl.value.name).toBe(testModel.subject || '');
  });

  it('should display an error message when required fields are missing', () => {
    fixture.detectChanges();

    component.submit();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Alle velden moeten ingevuld zijn.'
    });
  });

  it('should add a learning objective', () => {
    fixture.detectChanges();

    expect(component.formArrays.learningObjectives.length).toBe(0);

    component.addLearningObjective(undefined, 'New Learning Objective');

    expect(component.formArrays.learningObjectives.length).toBe(1);
    expect(component.formArrays.learningObjectives.at(0).get('name')?.value).toBe('New Learning Objective');
  });

  it('should add a multiple-answer question with answers', () => {
    fixture.detectChanges();

    component.addQuestion(
      undefined,
      QuestionType.MultipleChoice,
      'Sample Question',
      new ObjectiveModel({name: 'Learning Objective'}),
      [
        new AnswerModel({
          name: 'Answer 1',
          correct: true
        }),
        new AnswerModel({
          name: 'Answer 2',
          correct: false
        })
      ]
    );

    expect(component.formArrays.questions.length).toBe(1);

    const questionGroup = component.formArrays.questions.at(0);
    const answersArray = questionGroup.get('answers') as FormArray;

    expect(answersArray.length).toBe(2);
    expect(answersArray.at(0).get('name')?.value).toBe('Answer 1');
    expect(answersArray.at(1).get('name')?.value).toBe('Answer 2');
  });

  it('should add an open-ended question', () => {
    fixture.detectChanges();

    component.addQuestion(
      undefined,
      QuestionType.Open,
      'Open-ended question',
      new ObjectiveModel({name: 'Learning Objective'})
    );

    expect(component.formArrays.questions.length).toBe(1);
    const questionGroup = component.formArrays.questions.at(0);

    const answersArray = questionGroup.get('answers') as FormArray;
    expect(answersArray.length).toBe(1);
  });

  it('should add a hint to a question', () => {
    fixture.detectChanges();

    component.addQuestion(undefined, QuestionType.MultipleChoice, 'Sample Question', new ObjectiveModel({name: 'Learning Objective'}), [
      new AnswerModel({
        name: 'Answer 1',
        correct: true
      }),
      new AnswerModel({
        name: 'Answer 2',
        correct: false
      })
    ]);

    const questionGroup = component.formArrays.questions.at(0);

    component.addHint(questionGroup.get('hints') as FormArray, undefined, 'This is a hint.');

    const hintsArray = questionGroup.get('hints') as FormArray;

    expect(hintsArray.length).toBe(1);
    expect(hintsArray.at(0).value.name).toBe('This is a hint.');
  });

  it('should be invalid if there are no learningObjectives', () => {
    const testModel = createValidTestModel({
      learningObjectives: []
    });

    component.testModel = testModel;

    fixture.detectChanges();

    expect(component.formGroup.valid).toBeFalse();
  });

  it('should be invalid if there are no questions', () => {
    const testModel = createValidTestModel({
      questions: []
    });

    component.testModel = testModel;

    fixture.detectChanges();

    expect(component.formGroup.valid).toBeFalse();
  });

  it('should be invalid if there are are multiple answer questions with less than 2 answers', () => {
    const testModel = createValidTestModel({
      questions: [
        new QuestionModel({
          type: QuestionType.MultipleChoice,
          name: 'Question 1',
          learningObjectiveIndex: 1,
          answers: [
            new AnswerModel({
              name: 'Answer 1',
              correct: true
            }),
          ],
          hints: []
        })
      ]
    });

    expect(testModel.questions[0]).toBeTruthy();

    component.testModel = testModel;

    fixture.detectChanges();

    expect(component.formGroup.valid).toBeFalse();
  });

  it('should be valid if form is valid', () => {
    component.testModel = createValidTestModel();

    fixture.detectChanges();

    expect(component.formGroup.valid).toBeTrue();
  });

  it('should keep the order of questions when exporting', () => {
    const question1 = new QuestionModel({
      type: QuestionType.MultipleChoice,
      name: 'Question 1',
      learningObjectiveIndex: 1,
      answers: [
        new AnswerModel({ name: 'Answer 1', correct: true }),
        new AnswerModel({ name: 'Answer 2', correct: false })
      ],
      hints: []
    });
    const question2 = new QuestionModel({
      type: QuestionType.MultipleChoice,
      name: 'Question 2',
      learningObjectiveIndex: 2,
      answers: [
        new AnswerModel({ name: 'Answer 3', correct: true }),
        new AnswerModel({ name: 'Answer 4', correct: false })
      ],
      hints: []
    });
  
    const testModel = createValidTestModel({
      questions: [question1, question2]
    });
  
    component.testModel = testModel;
    fixture.detectChanges();
  
    const exportedTestModel = component['exportForm']();
  
    expect(exportedTestModel.questions.length).toBe(2);
    expect(exportedTestModel.questions[0].name).toBe(question1.name);
    expect(exportedTestModel.questions[1].name).toBe(question2.name);
  });
});

