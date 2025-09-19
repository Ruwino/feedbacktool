import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageModule, DropdownModule, RouterModule],
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
})
export class StudentListComponent {
  @Input() results!: { name: string; goal: string; score: number; date: string; email?: string; testName?: string }[];
  @Input() selectedClass!: number | null;

  constructor(private router: Router) {}
  
  viewStudentGrades(studentEmail: string, studentName: string): void {
    console.log('Navigating to grades for:', studentEmail, studentName);
    
    if (!studentEmail) {
      console.error('Student email is missing!');
      return;
    }
    
    // Navigeer naar de cijferoverzichtpagina met student parameters
    this.router.navigate(['/grade/overview', studentEmail], { 
      queryParams: { name: studentName } 
    });
  }

  /**
   * Bepaalt de CSS-klasse voor het score-icoon op basis van het percentage
   * @param score De behaalde score als percentage
   * @returns CSS class naam voor kleurcodering
   */
  getScoreClass(score: number): string {
    if (score >= 80) {
      return 'score-excellent'; // Groen + duimpje (≥80%)
    } else if (score >= 60) {
      return 'score-good';      // Groen (60-80%)
    } else if (score >= 50) {
      return 'score-moderate';  // Lichtoranje (50-60%)
    } else {
      return 'score-poor';      // Donkerder oranje (<50%)
    }
  }
  
  /**
   * Bepaalt of een duimpje moet worden getoond bij het bolletje
   * @param score De behaalde score als percentage
   * @returns True als een duimpje getoond moet worden (≥50%)
   */
  showThumbsUp(score: number): boolean {
    return score >= 80;
  }
}