import { NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TestOverviewService } from '../../services/test-overview.service';
import { SubjectModel } from '../../models/subjectModel';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router'

@Component({
  selector: 'app-test-overview',
  standalone: true,
  imports: [NgFor, NgIf, DropdownModule, FormsModule, RouterModule],
  templateUrl: './test-overview.component.html',
  styleUrl: './test-overview.component.css'
})


/**
 * @author Latricha Seym
 * @description This component is responsible for displaying the tests available for each subject.
 */
export class TestOverviewComponent implements OnInit {

  selectedTest = '';

  public subjects: SubjectModel[] = [];
  tests = [
    { label: 'Naam', value: 'name' },
    { label: 'Start', value: 'date' },
    { label: 'Duur', value: 'duration' }
  ];



  /**
   * 
   * @param testOverviewService 
   */
  constructor(private testOverviewService: TestOverviewService) {

  }


  ngOnInit() {
    this.getSubjects();
  }

  /**
   * @author Latricha Seym
   * @description This method fetches the subjects from the backend.
   */
  public getSubjects(): void {

    this.testOverviewService.getSubjects().subscribe(subjects => {
      this.subjects = subjects;
    });
  }


}





