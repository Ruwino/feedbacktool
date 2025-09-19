import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentListComponent } from '../../elements/student-list/student-list.component';
import { StudentListService } from '../../services/student-list-service/student-list.service';
import { Student } from '../../models/student.model';
import { DropdownModule } from 'primeng/dropdown';
import { ClassService } from '../../../class/services/class.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-student-overview',
  standalone: true,
  imports: [CommonModule, FormsModule, StudentListComponent, DropdownModule],
  templateUrl: './student-overview.component.html',
  styleUrls: ['./student-overview.component.css'],
})
export class StudentOverviewComponent implements OnInit, OnDestroy {
  results: Student[] = [];
  classes: { label: string; value: number }[] = [];
  selectedClass: number | null = null;
  private subscriptions: Subscription[] = [];

  constructor(
    private studentService: StudentListService,
    private classService: ClassService
  ) {}

  ngOnInit() {
    // 1. Laad klassen voor de dropdown
    this.loadClasses();

    // 2. Abonneer op student updates
    const studentSub = this.studentService.students$.subscribe((students) => {
      this.results = students;
    });
    this.subscriptions.push(studentSub);

  }

  ngOnDestroy() {
    // Opruimen van subscriptions om memory leaks te voorkomen
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  loadClasses() {
    const classSub = this.classService.getClassesAsDropdownOptions().subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (err) => {
        console.error('Error loading classes:', err);
        // Fallback naar hardcoded opties
        this.classes = [
          { label: 'Leerjaar 2 - Biologie 1', value: 1 },
          { label: 'Leerjaar 2 - Biologie 2', value: 2 },
          { label: 'Leerjaar 2 - Biologie 3', value: 3 },
        ];
      },
    });
    this.subscriptions.push(classSub);
  }

  onClassChange() {
    if (this.selectedClass) {
      this.studentService.loadStudentsFromClass(this.selectedClass);
    } else {

      const mockStudents: Student[] = [
        { name: 'Ronnie Bol', goal: 'Gezondheid', score: 7, date: '11/02/2025', email: 'ronnie@example.com' },
        { name: 'Bonnie Rol', goal: 'Gezondheid', score: 11, date: '11/02/2025', email: 'bonnie@example.com' },
      ];
      // @ts-ignore - Gebruik studentsSubject (private property)
      this.studentService.studentsSubject.next(mockStudents);
    }
  }
}