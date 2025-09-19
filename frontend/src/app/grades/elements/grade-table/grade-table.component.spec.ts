import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradeTableComponent } from './grade-table.component';
import { By } from '@angular/platform-browser';
import { Grade } from '../../models/grade';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('GradeTableComponent', () => {
  let component: GradeTableComponent;
  let fixture: ComponentFixture<GradeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        GradeTableComponent,
        TableModule,
        ButtonModule,
        RippleModule,
        NoopAnimationsModule
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GradeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display warning indicator for scores below 50%', () => {
    component.grades = [
      { 
        subject: 'Wiskunde', 
        score: '4/12', 
        percentage: 33, 
        learningObjectives: ['Basisbewerkingen'],
        id: '1'
      } as Grade
    ];
    fixture.detectChanges();

    // Zoek naar het element met class 'score-poor'
    const warningIndicator = fixture.debugElement.query(By.css('.score-poor'));
    expect(warningIndicator).toBeTruthy();
  });

  it('should display success indicator for scores above 70%', () => {
    component.grades = [
      { 
        subject: 'Biologie', 
        score: '9/12', 
        percentage: 75, 
        learningObjectives: ['Celbiologie'],
        id: '2'
      } as Grade
    ];
    fixture.detectChanges();

    // Zoek naar het element met class 'score-good'
    const successIndicator = fixture.debugElement.query(By.css('.score-good'));
    expect(successIndicator).toBeTruthy();
  });

  it('should display excellent indicator with thumbs up for scores above 80%', () => {
    component.grades = [
      { 
        subject: 'Scheikunde', 
        score: '10/12', 
        percentage: 83, 
        learningObjectives: ['Moleculen'],
        id: '3'
      } as Grade
    ];
    fixture.detectChanges();

    // Zoek naar het element met class 'score-excellent'
    const excellentIndicator = fixture.debugElement.query(By.css('.score-excellent'));
    expect(excellentIndicator).toBeTruthy();
    
    // Zoek naar de thumbs-up icon
    const thumbsUpIcon = fixture.debugElement.query(By.css('.thumb-icon'));
    expect(thumbsUpIcon).toBeTruthy();
  });

  it('should display grades correctly', () => {
    component.grades = [
      { 
        subject: 'Wiskunde', 
        score: '7/12', 
        percentage: 58, 
        learningObjectives: ['Algebra'],
        id: '4'
      } as Grade,
      { 
        subject: 'Biologie', 
        score: '8/12', 
        percentage: 67, 
        learningObjectives: ['Cellen'],
        id: '5'
      } as Grade,
      { 
        subject: 'Scheikunde', 
        score: '9/12', 
        percentage: 75, 
        learningObjectives: ['Moleculen'],
        id: '6'
      } as Grade
    ];
    fixture.detectChanges();

    // Controleer of alle vakken worden weergegeven
    const subjects = fixture.debugElement.queryAll(By.css('td:nth-child(2)'));
    expect(subjects.length).toBe(3);
    expect(subjects[0].nativeElement.textContent).toContain('Wiskunde');
    expect(subjects[1].nativeElement.textContent).toContain('Biologie');
    expect(subjects[2].nativeElement.textContent).toContain('Scheikunde');
    
    // Controleer scores
    const scores = fixture.debugElement.queryAll(By.css('.score-cell span'));
    expect(scores.length).toBe(3);
    expect(scores[0].nativeElement.textContent).toContain('7/12');
    expect(scores[1].nativeElement.textContent).toContain('8/12');
    expect(scores[2].nativeElement.textContent).toContain('9/12');
  });
});