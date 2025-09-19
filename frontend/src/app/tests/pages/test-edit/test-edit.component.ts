import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TestModel } from '../../models/test.model';
import { TestService } from '../../services/test.service';
import { CommonModule } from '@angular/common';
import { TestFormComponent, TestFormSubmitEvent } from '../../elements/test-form/test-form.component';
import { SubjectService } from '../../../class/services/subject.service';

@Component({
  selector: 'app-test-edit',
  standalone: true,
  imports: [TestFormComponent, CommonModule],
  templateUrl: './test-edit.component.html',
  styleUrl: './test-edit.component.css'
})
export class TestEditComponent {
  public testModel!: TestModel;
  public pickableSubjects!: string[];

  constructor(private testService: TestService, private subjectService: SubjectService, private route: ActivatedRoute, private router: Router) { }

  private getTestId(): number {
    const testId = this.route.snapshot.paramMap.get('testId');

    if (!testId) { throw new Error(`TestId doesn't exist.`) }

    return parseInt(testId);
  }

  public ngOnInit(): void {
    this.subjectService.getSubjects().subscribe(subjects => {
      this.pickableSubjects = subjects.map(s => s.name);
    });

    const testId = this.getTestId();

    this.testService.getTest(testId).subscribe({
      next: (testModel: TestModel) => {
        if (testModel.canEdit) {
          this.testModel = testModel;
        } else {
          this.router.navigate(['/request-error/401'], { replaceUrl: true });
        }
      },
      error: (error: any) => {
        if (error.status === 404) {
          this.router.navigate(['/request-error/404'], { replaceUrl: true });
        } else {
          this.router.navigate(['/request-error/500'], { replaceUrl: true });
        }
      }
    });
  }

  public onSubmit(event: TestFormSubmitEvent) {
    this.testService.editTest(event.testModel).subscribe({
      next: () => {
        event.messageService.add({ severity: 'success', summary: 'Toets aangepast', detail: 'De toets is succesvol aangepast.' });
      },
      error: () => {
        event.messageService.add({ severity: 'error', summary: 'Error', detail: 'Er is een fout opgetreden.' });
      }
    });
  }
}
