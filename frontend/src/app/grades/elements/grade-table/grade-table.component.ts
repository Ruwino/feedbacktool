import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Grade } from '../../models/grade';

@Component({
  selector: 'app-grade-table',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, RippleModule],
  templateUrl: './grade-table.component.html',
  styleUrls: ['./grade-table.component.css']
})
export class GradeTableComponent implements OnInit {
  @Input() grades: Grade[] = [];
  cols: unknown[] = [];
  expandedRows: { [key: string]: boolean } = {};

  ngOnInit() {
    this.cols = [
      { field: 'subject', header: 'Test' },
      { field: 'score', header: 'Score' }
    ];
  }

  /**
   * Determines the CSS class for the circle based on the percentage
   * @param percentage The achieved score as a percentage (numeric value)
   * @returns CSS class name for color coding
   */
  getScoreCircleClass(percentage: number): string {
    if (percentage >= 80) {
      return 'score-excellent'; // Green + thumbs up (≥80%)
    } else if (percentage >= 60) {
      return 'score-good';      // Green (60-80%)
    } else if (percentage >= 50) {
      return 'score-moderate';  // Light orange + thumbs up (50-60%)
    } else {
      return 'score-poor';      // Darker orange + exclamation mark (<50%)
    }
  }

  /**
   * Determines if a thumbs-up icon should be shown for the circle
   * @param percentage The achieved score as a percentage
   * @returns True if a thumbs-up should be shown (≥50%)
   */
  showThumbsUp(percentage: number): boolean {
    return percentage >= 80;
  }
}