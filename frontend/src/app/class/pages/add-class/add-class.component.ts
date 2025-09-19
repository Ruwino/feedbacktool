import { Component, OnInit } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from "@angular/forms";
import { FloatLabelModule } from "primeng/floatlabel";
import { DropdownModule } from "primeng/dropdown";
import { CheckboxModule } from "primeng/checkbox";
import { ButtonModule } from "primeng/button";
import { CommonModule } from '@angular/common';
import { StudentService } from "../../services/student.service";
import { Student } from "../../models/Student";
import { SubjectService } from "../../services/subject.service";
import { Subject } from "../../models/Subject";
import { ClassService } from "../../services/class.service";
import { Class } from "../../models/Class";
import { Router } from '@angular/router';
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {ProgressBarModule} from "primeng/progressbar";

@Component({
  selector: 'app-add-class',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    FloatLabelModule,
    DropdownModule,
    CheckboxModule,
    ButtonModule,
    CommonModule,
    ToastModule,
    ProgressBarModule
  ],
  templateUrl: './add-class.component.html',
  styleUrls: ['./add-class.component.css']
})
export class AddClassComponent implements OnInit {
  private _subjects: Subject[] = [];
  private _grades: string[] = [];
  private _selectedSubject = '';
  private _selectedGrade = '';
  private _students: Student[] = [];
  private _selectedStudents: Student[] = [];
  private _searchTerm = '';
  private _nieuweKlas = '';
  private _loadingStudents = false;
  private _isSubmitting = false;
  private _noStudentsFound = false;

  constructor(
    private studentService: StudentService,
    private subjectService: SubjectService,
    private classService: ClassService,
    private router: Router,
    private messageService: MessageService
  ) {}

  public ngOnInit() {
    this.fetchSubjects();
    this.fetchGrades();
    this.fetchStudents()
  }

  /**
   * @author Stijn Prent
   * @description Fetches subjects from the backend
   */
  private fetchSubjects(): void {
    this.subjectService.getAllSubjects().subscribe({
      next: (subjects) => {
        this._subjects = subjects;
      },
      error: (error) => {
        this._subjects = [];
        console.error('Error fetching subjects:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is iets fout gegaan met het ophalen van de vakken.' });
      }
    });
  }

  /**
   * @author Stijn Prent
   * @description Fetches grades
   */
  private fetchGrades(): void {
    this._grades = ['1', '2', '3', '4'];
  }

  /**
   * @author Stijn Prent
   * @description Fetches students for the selected grade
   */
  private fetchStudents(): void {
    this._loadingStudents = true;

    this.studentService.getStudents().subscribe({
      next: (students) => {
        this._students = students;
        this._loadingStudents = false;
        if(students.length <= 0) {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Er zijn geen studenten gevonden.' });
          this._noStudentsFound = true;
        }
      },
      error: (error) => {
        this._students = [];
        this._loadingStudents = false;
        console.error('Error fetching students:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is iets fout gegaan met het ophalen van de studenten.' });
      }
    });
  }

  /**
   * @author Stijn Prent
   * @description This function will filter the students based on the search term
   */
  public filteredStudents(): Student[] {
    return this._students.filter(student => {
      const name = student.firstName + ' ' + student.lastName;
      return name.toLowerCase().includes(this._searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(this._searchTerm.toLowerCase());
    });
  }

  /**
   * @author Stijn Prent
   * @description This function will take the entered class name, selected grade, subject, and students,
   * and send it to the backend via the `ClassService`
   */
  public addClass(): void {
    if (!this._nieuweKlas || !this._selectedGrade || !this._selectedSubject) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Alle velden moeten ingevuld zijn.' });
      return;
    }

    this._isSubmitting = true;

    const newClass = new Class(
      this._nieuweKlas,
      parseInt(this._selectedGrade),
      parseInt(this._selectedSubject),
      this._selectedStudents
    );

    this.classService.addClass(newClass).subscribe({
      next: () => {
        this.resetForm();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Klas is succesvol aangemaakt.' });
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is iets fout gegaan met het aanmaken van de klas.' });
        console.error("Error adding class:", error);
      },
      complete: () => {
        this._isSubmitting = false;
      }
    });
  }

  /**
   * @author Stijn Prent
   * @description Resets form after successful submission
   */
  private resetForm(): void {
    this._nieuweKlas = '';
    this._selectedGrade = '';
    this._selectedSubject = '';
    this._selectedStudents = [];
  }

  public get subject(): Subject[] {
    return this._subjects;
  }

  public get grade(): string[] {
    return this._grades;
  }

  public get students(): Student[] {
    return this._students;
  }

  public get selectedSubject(): string {
    return this._selectedSubject;
  }

  public set selectedSubject(value: string) {
    this._selectedSubject = value;
  }

  public get selectedGrade(): string {
    return this._selectedGrade;
  }

  public set selectedGrade(value: string) {
    this._selectedGrade = value;
  }

  public get selectedStudents(): Student[] {
    return this._selectedStudents;
  }

  public set selectedStudents(value: Student[]) {
    this._selectedStudents = value;
  }

  public get searchTerm(): string {
    return this._searchTerm;
  }

  public set searchTerm(value: string) {
    this._searchTerm = value;
  }

  public get nieuweKlas(): string {
    return this._nieuweKlas;
  }

  public set nieuweKlas(value: string) {
    this._nieuweKlas = value;
  }

  public get loadingStudents(): boolean {
    return this._loadingStudents;
  }

  public get isSubmitting(): boolean {
    return this._isSubmitting;
  }

  public get noStudentsFound(): boolean {
    return this._noStudentsFound;
  }
}
