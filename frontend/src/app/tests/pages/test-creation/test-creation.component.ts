import { Component, OnInit } from '@angular/core';
import { TestFormSubmitEvent, TestFormComponent } from '../../elements/test-form/test-form.component';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { SubjectService } from '../../../class/services/subject.service';
import { Router } from '@angular/router';
import { TestModel } from '../../models/test.model';

@Component({
  selector: 'app-test-creation',
  standalone: true,
  imports: [TestFormComponent, CommonModule],
  templateUrl: './test-creation.component.html',
  styleUrl: './test-creation.component.css'
})

export class TestCreationComponent implements OnInit {
  public pickableSubjects!: string[];

  private testId: number | null = null;

  constructor(private testService: TestService, private subjectService: SubjectService, private router: Router) { }

  public ngOnInit(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.pickableSubjects = subjects.map(s => s.name);
    });
  }

  public onSubmit(event: TestFormSubmitEvent) {
    event.disableInput();

    this.testService.createTest(event.testModel).subscribe({
      next: (testId: number) => {
        event.messageService.add({ severity: 'success', summary: 'Toets aangemaakt', detail: 'De toets is succesvol aangemaakt.' });

        event.testModel.id = testId;
        event.testModel.canEdit = true;

        this.testId = testId;
      },
      error: () => {
        event.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is een fout opgetreden.' });

        setTimeout(() => {
          event.enableInput();
        }, 1000);
      }
    });
  }

  public onEdit() {
    this.router.navigate([`/test/edit/${this.testId}`], { replaceUrl: true });
  }
}
