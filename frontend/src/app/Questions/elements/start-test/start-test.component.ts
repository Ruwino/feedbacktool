import { Component, EventEmitter, Output, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { QuestionService } from '../../services/question.service';

@Component({
  selector: 'app-start-test',
  templateUrl: './start-test.component.html',
  styleUrls: ['./start-test.component.css'],
  standalone: true,
  imports: [CommonModule, ButtonModule,]
})
export class StartTestComponent implements OnInit {
  @Input() testId = 0; 
  public testTitle = "";
  public learningObjectives: string[] = [];
  @Output() startTest = new EventEmitter<void>();

  constructor(private questionService: QuestionService) {}

  ngOnInit(): void {
    if (this.testId) {
      this.loadTestData(this.testId);
    }
  }

  onStartTest(): void {
    this.startTest.emit();
  }

  loadTestData(testId: number): void {
    this.questionService.getTestData(testId).subscribe((data) => {
      this.testTitle = data.name;
      this.learningObjectives = data.objectives;
    });
  }
}
