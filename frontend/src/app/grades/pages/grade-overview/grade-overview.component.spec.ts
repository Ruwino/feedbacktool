import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GradeOverviewComponent } from './grade-overview.component';
import { HttpClientTestingModule } from '@angular/common/http/testing'; // Importeer deze
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GradeOverviewComponent', () => {
  let component: GradeOverviewComponent;
  let fixture: ComponentFixture<GradeOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GradeOverviewComponent, HttpClientTestingModule], // Voeg HttpClientTestingModule toe
      providers: [
        // Mock ActivatedRoute als die nodig is
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'student@example.com' }),
            queryParamMap: of({ get: () => 'Student Name' }),
            data: of({ viewMode: 'teacher' }) 
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GradeOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});