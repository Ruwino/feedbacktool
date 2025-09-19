import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StudentListComponent } from './student-list.component';
import { StudentListService } from '../../services/student-list-service/student-list.service';
import { ClassService } from '../../../class/services/class.service';
import { RouterModule } from '@angular/router';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, 
        StudentListComponent, // Moved from declarations to imports
        RouterModule.forRoot([]) // Add this to provide router for the component
      ],
      providers: [StudentListService, ClassService]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
    
    component.results = []; 
    component.selectedClass = 1; 
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});