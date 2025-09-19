import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { QuestionSubmitEvent } from '../../interfaces/QuestionSubmitEvent';
import { QuestionModel } from '../../models/QuestionModel';

@Component({
  selector: 'app-open-question',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ButtonModule, FormsModule], 
  templateUrl: './open-question.component.html',
  styleUrl: './open-question.component.css'
})
export class OpenQuestionComponent implements OnChanges {
  @Input() question!: QuestionModel; 
  @Input() questionIndex = 0; 
  @Input() totalQuestions = 1; 
  @Output() private onSubmit = new EventEmitter<QuestionSubmitEvent>();
  @Input() isCorrect: boolean | null = null;  

  public answer = '';
  public hasSubmitted = false;
  public hints: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question']) {
      this.resetState();
    }
  }

   public submit(answer: string) {
     const event: QuestionSubmitEvent = {
       questionId: this.question.id,
       answer: answer,
       success: (hint?: string) => {
          this.hasSubmitted = true;
          if(hint && !this.hints.includes(hint)) {
            this.hints.push(hint)
          }
       }
     };
 
     this.onSubmit.emit(event);
   }

   private resetState() {
    this.answer = "";
    this.hints = [];
    this.hasSubmitted = false;
    this.isCorrect = null;
  }
}
