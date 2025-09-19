import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges} from '@angular/core';
import { QuestionSubmitEvent } from '../../interfaces/QuestionSubmitEvent';
import { QuestionModel } from '../../models/QuestionModel';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-multiple-choice',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule
  ],
  templateUrl: './multiple-choice.component.html',
  styleUrl: './multiple-choice.component.css'
})
export class MultipleChoiceComponent implements OnChanges{
  @Input() question!: QuestionModel;
  @Input() questionIndex = 0;
  @Input() totalQuestions = 1;
  @Output() private onSubmit = new EventEmitter<QuestionSubmitEvent>();
  @Input() submitted = false;  
  @Input() isCorrect: boolean | null = null;  

  public selectedAnswer: string | null = null;
  public disabledAnswers = new Set<string>(); 
  public hints: string[] = [];
  public hasSubmitted = false;
  public selectedAnswerIndex: number | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question']) {
      this.resetState();
    }
  }
  
  public selectAnswer(answer: string, index: number) {
    this.selectedAnswer = answer;
    this.selectedAnswerIndex = index;
    this.hasSubmitted = false;
    this.isCorrect = null;
  }

  public submit() {
    const selectedAnswer = this.selectedAnswer;

    if(!selectedAnswer) {
      return;
    }

    this.hasSubmitted = false;

    const event: QuestionSubmitEvent = {
      questionId: this.question.id,
      answer: selectedAnswer,
      success: (hint?: string, correct?: boolean) => {
        this.hasSubmitted = true;
        this.isCorrect = correct ?? false;
        if(hint && !this.hints.includes(hint)) {
          this.hints.push(hint);
        }
        this.disabledAnswers.add(this.selectedAnswer!);
      }
    };

    this.onSubmit.emit(event);
  }

  private resetState() {
    this.selectedAnswer = null;
    this.disabledAnswers.clear();
    this.hints = [];
    this.hasSubmitted = false;
    this.selectedAnswerIndex = null;
    this.isCorrect = null;
  }
}
