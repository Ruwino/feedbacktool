import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule, Location } from '@angular/common';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CheckboxModule } from 'primeng/checkbox';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ToastModule } from "primeng/toast";
import { MessageService } from "primeng/api";
import { QuestionType } from '../../enums/questionType.enum';
import { TestModel } from '../../models/test.model';
import { QuestionModel } from '../../models/question.model';
import { AnswerModel } from '../../models/answer.model';
import { Router } from '@angular/router';
import { ObjectiveModel } from '../../models/objective.model';
import { HintModel } from '../../models/hint.model';
import { createValidTestModel } from '../../util/tests.util';

type QuestionFormGroup = FormGroup<{
  id: FormControl<number | undefined>,
  type: FormControl<QuestionType>,
  name: FormControl<string>
  learningObjective: FormControl<{ id: number | undefined, name: string, index: number } | null>,
  answers: FormArray<AnswerFormGroup>,
  hints: FormArray<HintFormGroup>
}>;

type AnswerFormGroup = FormGroup<{ id: FormControl<number | undefined>, name: FormControl<string>; correct: FormControl<boolean> }>;
type HintFormGroup = FormGroup<{ id: FormControl<number | undefined>, name: FormControl<string> }>;

export interface TestFormSubmitEvent {
  testModel: TestModel;
  messageService: MessageService;
  enableInput: () => void;
  disableInput: () => void;
}

@Component({
  selector: 'app-test-form',
  standalone: true,
  imports: [ToastModule, InputSwitchModule, CheckboxModule, FormsModule, ReactiveFormsModule, InputTextareaModule, MultiSelectModule, CalendarModule, ButtonModule, InputTextModule, DropdownModule, CommonModule],
  templateUrl: './test-form.component.html',
  styleUrl: './test-form.component.css'
})
export class TestFormComponent implements OnInit {
  @ViewChild('contentContainer') contentContainer!: ElementRef;
  @ViewChild('learningObjectivesContainer') learningObjectivesContainer!: ElementRef;

  private _QuestionType = QuestionType;
  private _formGroup!: FormGroup;
  private _minDuration = new Date();
  private _dropdownSubjects!: { name: string }[];
  private _submitDisabled = false;

  private _maxHintsLength = 2;
  private _minAnswersLength = 2;
  private _maxAnswersLength = 7;

  public inputDisabled: boolean = false;

  public formControls!: {
    name: FormControl<string>,
    subject: FormControl<{ name: string }>,
    duration: FormControl<Date>,
    randomized: FormControl<boolean>
  }

  public formArrays!: {
    learningObjectives: FormArray<FormGroup<{ id: FormControl<number | undefined>, name: FormControl<string>, index: FormControl<number> }>>
    questions: FormArray<QuestionFormGroup>
  }

  @Input() public testModel: TestModel | null = null;
  @Input() public pickableSubjects?: string[];
  @Input() public title: string = 'Toets aanmaken';
  @Input() public readOnly: boolean = false;
  @Input() public editDisabled: boolean = false;

  @Output() private onSubmit = new EventEmitter<TestFormSubmitEvent>();
  @Output() public onEdit = new EventEmitter();

  constructor(private fb: FormBuilder, private messageService: MessageService, private location: Location, private router: Router) { }

  ngOnInit(): void {
    console.log(this.testModel, createValidTestModel())
    this._minDuration.setHours(0, 10, 0, 0);

    if (this.pickableSubjects) {
      this._dropdownSubjects = this.pickableSubjects.map(name => {
        return { name: name };
      });
    } else if (this.testModel) {
      this._dropdownSubjects = [{ name: this.testModel.subject }];
    } else {
      this._dropdownSubjects = [];
    }

    let duration: Date | null = null;

    if (this.testModel?.duration) {
      duration = new Date();
      duration.setHours(0, this.testModel.duration, 0, 0);
    }

    this._formGroup = this.fb.group({
      name: [this.testModel?.name, Validators.required],
      subject: [{ name: this.testModel?.subject }, [Validators.required, Validators.minLength(1)]],
      duration: [duration, Validators.required],
      randomized: [this.testModel?.randomized || false],
      learningObjectives: this.fb.array([], Validators.required),
      questions: this.fb.array([], Validators.required)
    });

    this.formControls = {
      name: this.formGroup.get('name') as FormControl,
      subject: this.formGroup.get('subject') as FormControl,
      duration: this.formGroup.get('duration') as FormControl,
      randomized: this.formGroup.get('randomized') as FormControl
    }

    this.formArrays = {
      learningObjectives: this.formGroup.get('learningObjectives') as FormArray,
      questions: this.formGroup.get('questions') as FormArray
    }

    for (const objective of this.testModel?.learningObjectives || []) {
      this.addLearningObjective(objective.id, objective.name);
    }

    console.log(this.testModel)

    for (const question of this.testModel?.questions || []) {
      const learningObjective = this.testModel?.learningObjectives[question.learningObjectiveIndex]

      this.addQuestion(question.id, question.type, question.name, learningObjective, question.answers, question.hints, true, question.learningObjectiveIndex);
    }

    if (this.readOnly) {
      this.formGroup.disable();
    }
  }

  private scrollToElement(element: ElementRef): void {
    const nativeElement = element?.nativeElement;

    if (nativeElement) {
      const rect = nativeElement.getBoundingClientRect();
      const isElementInView = rect.bottom <= window.innerHeight;

      if (!isElementInView) {
        nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }
  }

  public onDurationFocus() {
    if (!this.formControls.duration.value) {
      this.formControls.duration.setValue(this.minDuration);
    }
  }

  public trackByIndex(index: number): number {
    return index; // This allows Angular to track items by index
  }

  private validateForm(): [boolean, string | null] {
    if (!this.formGroup.invalid) return [true, null];

    let errorMessage = 'Alle velden moeten ingevuld zijn.';

    const hasInvalidControl = Object.values(this.formControls).some(control => control.invalid);
    const hasInvalidLearningObjectives = this.formArrays.learningObjectives.invalid;
    const hasInvalidQuestions = this.formArrays.questions.invalid;

    if (hasInvalidControl) {
      errorMessage = 'Alle velden moeten ingevuld zijn.';
    } else if (hasInvalidLearningObjectives) {
      errorMessage = 'Er moeten minstens één leerdoel worden toegevoegd.';
    } else if (hasInvalidQuestions) {
      const hasInvalidQuestion = this.formArrays.questions.controls.some(q => q.invalid);
      const hasInvalidAnswers = this.formArrays.questions.controls.some(q => {
        const answers = q.get('answers') as FormArray;
        return q.get('type')?.value === QuestionType.MultipleChoice && answers.length < this.minAnswersLength && answers.invalid;
      });

      if (!hasInvalidQuestion) {
        errorMessage = 'Er moet minstens één vraag worden toegevoegd.';
      } else if (hasInvalidAnswers) {
        errorMessage = 'Elke meerkeuzevraag moet minstens twee keuzes hebben.';
      }
    }

    return [false, errorMessage]
  }

  private exportForm(): TestModel {
    const duration = this.formControls.duration.value.getHours() * 60 + this.formControls.duration.value.getMinutes()

    const testModel = new TestModel(
      {
        id: this.testModel?.id,
        name: this.formControls.name.value,
        subject: this.formControls.subject.value.name,
        duration: duration,
        learningObjectives: this.formArrays.learningObjectives.value.map((o) => new ObjectiveModel({
          id: o?.id || undefined,
          name: o?.name as string
        })),
        randomized: this.formControls.randomized.value,
        questions: this.formArrays.questions.value.reverse().map(q =>
          new QuestionModel({
            id: q.id || undefined,
            type: q.type as QuestionType,
            name: q.name as string,
            learningObjectiveIndex: q.learningObjective?.index as number,
            answers: q.answers?.map((a) => {
              return new AnswerModel({
                id: a.id || undefined,
                name: a.name as string,
                correct: a.correct as boolean
              })
            }) as AnswerModel[],
            hints: q.hints?.map(h => new HintModel({
              id: h.id || undefined,
              name: h.name as string
            })) as HintModel[]
          })
        ),
      }
    );

    return testModel;
  }

  public submit(): void {
    const [success, error] = this.validateForm();

    if (!success) {
      error && this.messageService.add({ severity: 'error', summary: 'Error', detail: error });

      return;
    }

    if (!this.formGroup.dirty) {
      this.messageService.add({ severity: 'warn', summary: 'Toets is niet aangepast', detail: 'Maak aanpassingen voordat je opslaat.' });

      return;
    }

    const testModel = this.exportForm();

    this.testModel = testModel;

    this.onSubmit.emit({
      testModel: testModel,
      messageService: this.messageService,
      enableInput: () => {
        this._submitDisabled = false;

        this.formGroup.enable();

        this.inputDisabled = false;
      },
      disableInput: () => {
        this._submitDisabled = true;

        this.formGroup.disable();

        this.inputDisabled = true;
      }
    });

    this.formGroup.markAsPristine();
  }

  public addLearningObjective(id: number | undefined, name = ''): void {
    const learningObjective = this.fb.nonNullable.group(
      {
        id: id,
        name: [name, Validators.required],
        index: this.formArrays.learningObjectives.length
      });

    this.formArrays.learningObjectives.push(learningObjective);

    setTimeout(() => {
      this.scrollToElement(this.learningObjectivesContainer);
    });
  }

  public getHintsFormArray(question: QuestionFormGroup): FormArray<HintFormGroup> {
    return question.get('hints') as unknown as FormArray<HintFormGroup>;
  }

  public getAnswersFormArray(question: QuestionFormGroup): FormArray<AnswerFormGroup> {
    return question.get('answers') as unknown as FormArray<AnswerFormGroup>;
  }

  public addQuestion(
    id: number | undefined,
    type: QuestionType,
    name = '',
    learningObjective?: ObjectiveModel,
    answers: AnswerModel[] = [],
    hints: HintModel[] = [],
    disableScroll?: true,
    learningObjectiveIndex?: number,
  ): void {
    const answerValidators = type === QuestionType.MultipleChoice && [Validators.required, Validators.minLength(2)] || [Validators.required]
    const question: QuestionFormGroup = this.fb.nonNullable.group({
      id: [id],
      type: [type, Validators.required],
      name: [name, Validators.required],
      learningObjective: [learningObjective ? { id: learningObjective.id, name: learningObjective.name, index: learningObjectiveIndex as number } : null, Validators.required],
      answers: new FormArray<AnswerFormGroup>([], answerValidators),
      hints: new FormArray<HintFormGroup>([])
    });

    for (const answer of answers) {
      this.addAnswer(question.get('answers') as FormArray, answer.id, answer.name, answer.correct);
    }

    for (const hint of hints) {
      this.addHint(question.get('hints') as FormArray, hint.id, hint.name);
    }

    if (type === QuestionType.Open && answers.length === 0) {
      this.addAnswer(question.get('answers') as FormArray, undefined)
    }

    this.formArrays.questions.insert(0, question);

    // This will prevent the textarea from being oversized.
    setTimeout(() => {
      question.patchValue({
        name: name
      });

      if (!disableScroll && this.formArrays.questions.length === 1) {
        this.scrollToElement(this.contentContainer);
      }
    });
  }

  public removeFormArrayItem(formArray: FormArray, index: number) {
    if (formArray === this.formArrays.learningObjectives) {
      const removedObjective = formArray.controls[index];

      for (const formGroup of this.formArrays.questions.controls) {
        const questionObjective = formGroup.controls.learningObjective;

        if (removedObjective.value.name === questionObjective.value?.name) {
          questionObjective.setValue(null);
        }
      }
    }

    if (formArray.length > 0 && index >= 0 && index < formArray.length) {
      formArray.removeAt(index);
    }

    this.formGroup.markAsDirty();
  }

  public removeAnswer(answers: FormArray<AnswerFormGroup>, index: number) {
    this.removeFormArrayItem(answers, index);
    this.onAnswersChanged(answers);
  }

  public addAnswer(answers: FormArray<AnswerFormGroup>, id: number | undefined, name = '', correct?: boolean): void {
    const answer: AnswerFormGroup = this.fb.nonNullable.group({
      id: id,
      name: [name, Validators.required],
      correct: [correct || false]
    })

    // This will prevent the textarea from being oversized.
    setTimeout(() => {
      answer.patchValue({
        name: name
      })
    })

    answers.push(answer);

    if (correct === undefined) {
      this.onAnswersChanged(answers);
    }
  }

  public onAnswersChanged(answers: FormArray<AnswerFormGroup>): void {
    const hasAtLeastOneCorrect = answers.controls.some(answerControl => answerControl.get('correct')?.value === true);

    if (!hasAtLeastOneCorrect) {
      const currentAnswerControl = answers.at(0);
      currentAnswerControl?.patchValue({ correct: true });
    }
  }

  public addHint(hints: FormArray<HintFormGroup>, id: number | undefined, name = ''): void {
    const hint = this.fb.nonNullable.group({
      id: [id],
      name: [name, Validators.required]
    });

    hints.push(hint);
  }

  public onBack() {
    this.location.back();
  }

  public get submitDisabled(): boolean {
    return this._submitDisabled;
  }

  public get QuestionType() {
    return this._QuestionType;
  }

  public get formGroup(): FormGroup {
    return this._formGroup;
  }

  public get minDuration() {
    return this._minDuration;
  }

  public get dropdownSubjects(): { name: string }[] {
    return this._dropdownSubjects;
  }

  public get maxHintsLength() {
    return this._maxHintsLength;
  }

  public get minAnswersLength() {
    return this._minAnswersLength;
  }

  public get maxAnswersLength() {
    return this._maxAnswersLength;
  }
}
