import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { GradeTableComponent } from '../../elements/grade-table/grade-table.component';
import { GradeService } from '../../services/grade-service.service';
import { UserService } from '../../../dashboard/services/user.service';
import { Grade } from '../../models/grade';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-grade-overview',
  standalone: true,
  imports: [CommonModule, GradeTableComponent, ProgressSpinnerModule],
  templateUrl: './grade-overview.component.html',
  styleUrls: ['./grade-overview.component.css'],
})
export class GradeOverviewComponent implements OnInit {
  grades: Grade[] = [];
  showMessage = false;
  studentName = '';
  loading = false;
  viewMode: 'teacher' | 'student' = 'teacher';

  constructor(
    private gradeService: GradeService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Bepaal eerst of we in student- of docentmode zijn
    this.route.data.subscribe((data) => {
      this.viewMode = data['viewMode'] || 'teacher';

      if (this.viewMode === 'student') {
        this.loadStudentView();
      } else {
        this.loadTeacherView();
      }
    });
  }

  loadTeacherView(): void {
    // Bestaande logica voor docenten die cijfers bekijken
    this.route.paramMap.subscribe((params) => {
      const studentId = params.get('studentId') || params.get('id');

      this.route.queryParamMap.subscribe((queryParams) => {
        const studentName = queryParams.get('name');
        if (studentId && studentName) {
          // Set the selected student
          this.gradeService.setSelectedStudent(studentId, studentName);
          this.studentName = studentName;

          // Load the grades
          this.loadGrades();
        } else {
          console.warn('Missing studentId or name:', studentId, studentName);
        }
      });
    });
  }

  // In plaats van user gegevens op te halen via GradeService, gebruik UserService
  loadStudentView(): void {
    this.loading = true;

    // Gebruik alleen de getUserRole methode die we weten dat werkt
    this.userService.getUserRole().subscribe((role) => {
      if (role) {
        this.studentName = 'Mijn cijferoverzicht'; 

        this.loadMyGrades();
      } else {
        console.error('User role not available');
        this.showMessage = true;
        this.loading = false;
      }
    });
  }

  loadGrades(): void {
    this.loading = true;
    this.gradeService.getGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.showMessage = grades.length === 0;
        this.loading = false;

        if (grades.length === 0) {
          console.warn('No grades received for student');
        }
      },
      error: (error) => {
        console.error('Error loading grades:', error);
        this.showMessage = true;
        this.loading = false;
      },
    });
  }

  loadMyGrades(): void {
    this.loading = true;
    this.gradeService.getMyGrades().subscribe({
      next: (grades) => {
        this.grades = grades;
        this.showMessage = grades.length === 0;
        this.loading = false;

        if (grades.length === 0) {
          console.warn('No grades found for current student');
        }
      },
      error: (error) => {
        console.error('Error loading student grades:', error);
        this.showMessage = true;
        this.loading = false;
      },
    });
  }
}
