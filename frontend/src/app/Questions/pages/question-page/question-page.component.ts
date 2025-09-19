import { Component, OnInit } from '@angular/core';
import { OpenQuestionComponent } from '../../elements/open-question/open-question.component';
import { StartTestComponent } from '../../elements/start-test/start-test.component';
import { MultipleChoiceComponent } from '../../elements/multiple-choice/multiple-choice.component';
import { CommonModule } from '@angular/common';
import { QuestionService } from '../../services/question.service';
import { QuestionModel } from '../../models/QuestionModel';
import { ButtonModule } from 'primeng/button';
import { QuestionSubmitEvent } from '../../interfaces/QuestionSubmitEvent';
import { ActivatedRoute } from '@angular/router';
import { EndTestComponent } from '../../elements/end-test/end-test.component';

@Component({
  selector: 'app-question-page',
  standalone: true,
  imports: [
    OpenQuestionComponent,
    MultipleChoiceComponent,
    StartTestComponent,
    EndTestComponent,
    CommonModule,
    ButtonModule,
  ],
  templateUrl: './question-page.component.html',
  styleUrl: './question-page.component.css'
})
export class QuestionPageComponent implements OnInit {
  public questions: QuestionModel[] = [];
  public currentQuestionIndex = 0;
  public showHint = "";
  public showError = "";
  public testId = 0;
  public selectedAnswer: string | null = null; 
  public isCorrect = false;
  public hasStarted = false;
  private wrongAttemptCount = 0;
  public hasFinished = false;

  constructor(private questionService: QuestionService, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.testId = +params['testId'];
    });
  }

  public startTest() {
    this.loadQuestions(this.testId);
    this.hasStarted = true; 
  }

  public finishTest() {
    this.questionService.hasCompletedTest(this.testId).subscribe({
      next: (response: any) => {
        if (response.finished) {
          this.hasFinished = true;
        } else {
          this.showError = "Je moet alle vragen correct invullen voordat je de toets kan afronden!";

          setTimeout(() => {
            this.showError = "";
          }, 6000);
        }
      },
      error: (error) => {
        console.error("Something went wrong", error);
      }
    });
  }

  private loadQuestions(testId: number) {
    this.questionService.getQuestions(testId).subscribe({
      next: (questions) => {
        this.questions = questions;
        if (this.questions.length > 0) {
          this.currentQuestionIndex = 0;
        }
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  public nextQuestion() {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.resetQuestionState();
    }
  }

  public previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.resetQuestionState();
    }
  }

  private resetQuestionState() {
    this.isCorrect = false;
    this.selectedAnswer = null;
    this.showHint = "";
    this.wrongAttemptCount = 0;
  }

  public get currentQuestion(): QuestionModel | null {
    return this.questions.length > 0 ? this.questions[this.currentQuestionIndex] : null;
  }

  public trackByFn(index: number) {
    return index;
  }

  public onSubmit(questionSubmitEvent: QuestionSubmitEvent) {
    this.selectedAnswer = questionSubmitEvent.answer;
    this.questionService.answerQuestion(questionSubmitEvent.questionId, this.testId, questionSubmitEvent.answer).subscribe({
      next: (response) => {
        const isAnswerCorrect = response._correct;
        const hints: string[] = response._hint;
        this.isCorrect = isAnswerCorrect;

        if (isAnswerCorrect) {
          this.showHint = "";
          this.wrongAttemptCount = 0;

        } else {
          const hintToShow = hints[Math.min(this.wrongAttemptCount, hints.length - 1)];
          this.showHint = hintToShow;
          this.wrongAttemptCount += 1;

          questionSubmitEvent.success(hintToShow);
        }

        questionSubmitEvent.success();
      },
      error: (error) => {
        console.error("Something went wrong", error);
      }
    });
  }
}
