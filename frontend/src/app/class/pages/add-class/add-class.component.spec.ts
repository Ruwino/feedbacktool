import { of, throwError } from 'rxjs';
import { StudentService } from '../../services/student.service';
import { SubjectService } from '../../services/subject.service';
import { ClassService } from '../../services/class.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AddClassComponent } from './add-class.component';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Student } from '../../models/Student';
import { Subject } from '../../models/Subject';

describe('AddClassComponent', () => {
  let component: AddClassComponent;
  let fixture: ComponentFixture<AddClassComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let subjectService: jasmine.SpyObj<SubjectService>;
  let classService: jasmine.SpyObj<ClassService>;
  let messageService: any;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    studentService = jasmine.createSpyObj('StudentService', ['getStudents']);
    subjectService = jasmine.createSpyObj('SubjectService', ['getAllSubjects']);
    classService = jasmine.createSpyObj('ClassService', ['addClass']);

    messageService = {
      add: jasmine.createSpy('add'),
      messageObserver: of([])
    };

    router = jasmine.createSpyObj('Router', ['navigate']);

    subjectService.getAllSubjects.and.returnValue(of([]));
    studentService.getStudents.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [AddClassComponent],
      providers: [
        { provide: StudentService, useValue: studentService },
        { provide: SubjectService, useValue: subjectService },
        { provide: ClassService, useValue: classService },
        { provide: MessageService, useValue: messageService },
        { provide: Router, useValue: router }
      ]
    })
      .overrideComponent(AddClassComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AddClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should fetch subjects on init', () => {
    const subjects = [new Subject(1, 'Math')];
    subjectService.getAllSubjects.and.returnValue(of(subjects));

    component.ngOnInit();

    expect(component.subject).toEqual(subjects);
  });

  it('should handle error when fetching subjects', () => {
    subjectService.getAllSubjects.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.subject).toEqual([]);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Er is iets fout gegaan met het ophalen van de vakken.'
    });
  });

  it('should fetch students on init', () => {
    const students = [new Student('johndoe@hva.nl', 'John', 'Doe')];
    studentService.getStudents.and.returnValue(of(students));

    component.ngOnInit();

    expect(component.students).toEqual(students);
  });

  it('should handle error when fetching students', () => {
    studentService.getStudents.and.returnValue(throwError(() => new Error('Error')));

    component.ngOnInit();

    expect(component.students).toEqual([]);
    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Er is iets fout gegaan met het ophalen van de studenten.'
    });
  });

  it('should filter students based on search term', () => {
    component['_students'] = [
      new Student('johndoe@hva.nl', 'John', 'Doe'),
      new Student('janesmith@hva.nl', 'Jane', 'Smith')
    ];
    component.searchTerm = 'john';

    const filteredStudents = component.filteredStudents();

    expect(filteredStudents.length).toBe(1);
    expect(filteredStudents[0].firstName).toBe('John');
  });

  it('should add class successfully', () => {
    component['_nieuweKlas'] = 'Class 1';
    component['_selectedGrade'] = '1';
    component['_selectedSubject'] = '1';
    component['_selectedStudents'] = [new Student('johndoe@hva.nl', 'John', 'Doe')];
    classService.addClass.and.returnValue(of(void 0));

    component.addClass();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Success',
      detail: 'Klas is succesvol aangemaakt.'
    });
  });

  it('should handle error when adding class', () => {
    component['_nieuweKlas'] = 'Class 1';
    component['_selectedGrade'] = '1';
    component['_selectedSubject'] = '1';
    component['_selectedStudents'] = [new Student('johndoe@hva.nl', 'John', 'Doe')];
    classService.addClass.and.returnValue(throwError(() => new Error('Error')));

    component.addClass();

    expect(messageService.add).toHaveBeenCalledWith({
      severity: 'error',
      summary: 'Error',
      detail: 'Er is iets fout gegaan met het aanmaken van de klas.'
    });
  });

  it('should reset form after successful submission', () => {
    component['_nieuweKlas'] = 'Class 1';
    component['_selectedGrade'] = '1';
    component['_selectedSubject'] = '1';
    component['_selectedStudents'] = [new Student('johndoe@hva.nl', 'John', 'Doe')];
    classService.addClass.and.returnValue(of(void 0));

    component.addClass();

    expect(component.nieuweKlas).toBe('');
    expect(component.selectedGrade).toBe('');
    expect(component.selectedSubject).toBe('');
    expect(component.selectedStudents).toEqual([]);
  });
});
