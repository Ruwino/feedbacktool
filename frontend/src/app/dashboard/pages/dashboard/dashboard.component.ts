import {Component, OnInit} from '@angular/core';
import {TestColumnComponent} from "../../components/test-column/test-column.component";
import {SubjectModel} from "../../../TestOverview/models/subjectModel";
import {TestsService} from "../../services/tests.service";
import {StatCardComponent} from "../../components/stat-card/stat-card.component";
import {StatsService} from "../../services/stats.service";
import {StatCard} from "../../components/models/stat-card";
import {CardModule} from "primeng/card";
import {NgIf} from "@angular/common";
import {TableModule} from "primeng/table";
import {ButtonDirective, ButtonModule} from "primeng/button";
import {Router, RouterModule} from "@angular/router";
import {DropdownModule} from "primeng/dropdown";
import {Class} from "../../../class/models/Class";
import {ClassService} from "../../services/class.service";
import {FormsModule} from "@angular/forms";
import {Ripple, RippleModule} from "primeng/ripple";
import {Student} from "../../../class/models/Student";
import {UserService} from "../../services/user.service";
import {TestModel} from "../../../TestOverview/models/testModel";
import {ToggleButtonModule} from "primeng/togglebutton";
import {ToastModule} from "primeng/toast";
import {ConfirmationService, MessageService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {MultiSelectModule} from "primeng/multiselect";
import {StudentService} from "../../../class/services/student.service";
import {ConfirmDialogModule} from "primeng/confirmdialog";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    TestColumnComponent,
    StatCardComponent,
    CardModule,
    NgIf,
    TableModule,
    ButtonDirective,
    DropdownModule,
    FormsModule,
    Ripple,
    ButtonModule,
    RippleModule,
    ToggleButtonModule,
    ToastModule,
    TooltipModule,
    MultiSelectModule,
    ConfirmDialogModule,
    RouterModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  private _recommendedTests!: TestModel[];
  private _madeTestsStats!: StatCard;
  private _streakStats!: StatCard;
  private _bestObjective!: StatCard;
  private _isStudent: boolean = false;
  private _classes: Class[] = [];
  private _selectedClass!: Class;
  private _averageScoreStats!: StatCard;
  private _worstObjectiveStats!: StatCard;
  private _totalTestsStats!: StatCard;
  private _students: Student[] = [];
  private _classTests!: TestModel[];
  private _visible: boolean = false;
  private _allStudents: Student[] = [];
  private _selectedStudents: Student[] = [];

  constructor(
    private studentService: StudentService,
    private testService: TestsService,
    private statService: StatsService,
    private classService: ClassService,
    private userService: UserService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
  }

  public ngOnInit() {
    this.fetchUserRole();
  }

  public fetchUserRole(): void {
    this.userService.getUserRole().subscribe((role: string) => {
      this._isStudent = role === 'Student';
      if (this._isStudent) {
        this.fetchRecommendedTest();
        this.fetchStatsStudent();
      } else {
        this.fetchClasses(0);
      }
    })
  }

  private fetchRecommendedTest(): void {
    this.testService.getRecommendedTests().subscribe((recommendedTests: TestModel[]) => {
      this._recommendedTests = recommendedTests;
    });
  }

  public fetchStatsStudent(): void {
    this.statService.getMadeTestsStats().subscribe((madeTestsStats: StatCard) => {
      this._madeTestsStats = madeTestsStats;
    });
    this.statService.getBestObjective().subscribe((bestObjective: StatCard) => {
      this._bestObjective = bestObjective;
    });
    this.statService.getStreakStats().subscribe((streakStats: StatCard) => {
      this._streakStats = streakStats;
    });
  }

  public addStudentToClass(): void {
    if (this._selectedClass && this._selectedClass.id !== undefined) {
      this.classService.addStudentsToClass(this._selectedClass.id, this._selectedStudents).subscribe({
        next: () => {
          this.fetchStatsTeacher();
          const selectedIndex = this._classes.findIndex(cls => cls.id === this._selectedClass.id);
          this.fetchClasses(selectedIndex);
          this.selectedStudents = [];
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Studenten zijn toegevoegd aan de klas.'
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Er is iets fout gegaan met het toevoegen van de studenten aan de klas.'
          });
        }
      });
    }
  }

  public deleteStudent(student: string, event: Event): void {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Weet je zeker dat je deze leerling uit de klas wilt verwijderen?',
      header: 'Verwijderen',
      icon: 'pi pi-exclamation-triangle',
      acceptIcon:"none",
      rejectIcon:"none",
      rejectButtonStyleClass:"p-button-text",
      accept: () => {
        if (this._selectedClass && this._selectedClass.id !== undefined) {
          this.classService.removeStudentFromClass(this._selectedClass.id, student).subscribe({
            next: () => {
              this.fetchStatsTeacher();
              const selectedIndex = this._classes.findIndex(cls => cls.id === this._selectedClass.id);
              this.fetchClasses(selectedIndex);
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Student is verwijderd uit de klas.'
              });
            },
            error: () => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Er is iets fout gegaan met het verwijderen van de student uit de klas.'
              });
            }
          });
        }
      }, reject: () => {}
    });
  }

  private fetchAllStudents(): void {
    this.studentService.getStudents().subscribe({
      next: (students) => {
        this._allStudents = students.filter(student =>
          !this._selectedClass.students.some(selectedStudent => selectedStudent.email === student.email)
        );
        if (this._allStudents.length <= 0) {
          this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Er zijn geen studenten gevonden.' });
        }
      },
      error: (error) => {
        this._allStudents = [];
        console.error('Error fetching students:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is iets fout gegaan met het ophalen van de studenten.' });
      }
    });
  }

  public fetchStatsTeacher(): void {
    if (this._selectedClass && this._selectedClass.id !== undefined) {
      this.statService.getClassAverageScore(this._selectedClass.id).subscribe((averageScore: StatCard) => {
        this._averageScoreStats = averageScore;
      });
      this.statService.getClassWorstObjective(this._selectedClass.id).subscribe((worstObjective: StatCard) => {
        this._worstObjectiveStats = worstObjective;
      });
      this.statService.getClassTotalTests(this._selectedClass.id).subscribe((totalTests: StatCard) => {
        this._totalTestsStats = totalTests;
      });
      this.fetchClassTests();
      this.fetchAllStudents();
    }
  }

  public fetchClassTests(): void {
    if (this._selectedClass && this._selectedClass.id !== undefined) {
      this.testService.getTests(this._selectedClass.id).subscribe((tests: TestModel[]) => {
        this._classTests = tests;
      });
    }
  }

  public fetchClasses(classId: number): void {
    this.classService.getClasses().subscribe((classes: Class[]) => {
      this._classes = classes;
      if (this._classes.length > 0) {
        this.selectedClass = this._classes[classId];
        this._students = this._selectedClass.students;
      }
    });
  }

  public setVisibility(test: TestModel): void {
    if (test.visible !== undefined && this.selectedClass.id) {
      this.testService.setVisibility(test.id, this.selectedClass.id ,test.visible).subscribe({
        next: () => {},
        error: () => {
          this.showErrorToast('zichtbaar zetten niet gelukt');
        }
      });
    }
  }

  private showErrorToast(message: string): void {
    this.messageService.add({severity: 'error', summary: 'Error', detail: message});
  }

  public createTest(): void {
    this.router.navigate(['/test/create']);
  }

  public createClass(): void {
    this.router.navigate(['/class/add']);
  }

  public get recommendedTests(): TestModel[] {
    return this._recommendedTests;
  }

  public get madeTestsStats(): StatCard {
    return this._madeTestsStats;
  }

  public get streakStats(): StatCard {
    return this._streakStats;
  }

  public get bestObjective(): StatCard {
    return this._bestObjective;
  }

  public get isStudent(): boolean {
    return this._isStudent;
  }

  public set isStudent(isStudent: boolean) {
    this._isStudent = isStudent;
  }

  public get classes(): Class[] {
    return this._classes;
  }

  public get selectedClass(): Class {
    return this._selectedClass;
  }

  public set selectedClass(selectedClass: Class) {
    this._selectedClass = selectedClass;
    this._students = this._selectedClass.students;
    this.fetchStatsTeacher();
  }

  public get averageScoreStats(): StatCard {
    return this._averageScoreStats;
  }

  public get worstObjectiveStats(): StatCard {
    return this._worstObjectiveStats;
  }

  public get totalTestsStats(): StatCard {
    return this._totalTestsStats;
  }

  public get students(): Student[] {
    return this._students;
  }

  public get classTests(): TestModel[] {
    return this._classTests;
  }

  public get visible(): boolean {
    return this._visible;
  }

  public set visible(visible: boolean) {
    this._visible = visible;
  }

  public get allStudents(): Student[] {
    return this._allStudents;
  }

  public get selectedStudents(): Student[] {
    return this._selectedStudents;
  }

  public set selectedStudents(selectedStudents: Student[]) {
    this._selectedStudents = selectedStudents;
  }
}
