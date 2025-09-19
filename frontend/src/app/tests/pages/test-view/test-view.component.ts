import { Component, OnInit } from '@angular/core';
import { TestModel } from '../../models/test.model';
import { TestService } from '../../services/test.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TestFormComponent } from '../../elements/test-form/test-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [TestFormComponent, CommonModule],
  templateUrl: './test-view.component.html',
  styleUrl: './test-view.component.css'
})
export class TestViewComponent implements OnInit {
  public testModel!: TestModel;

  constructor(private testService: TestService, private route: ActivatedRoute, private router: Router) {}

  private getTestId(): number {
    const testId = this.route.snapshot.paramMap.get('testId');

    if (!testId) { throw new Error(`TestId doesn't exist.`) }

    return parseInt(testId);
  }

  public ngOnInit(): void {
    const testId = this.getTestId();

    this.testService.getTest(testId).subscribe({
      next: (testModel: TestModel) => {
        this.testModel = testModel;
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

  public onEdit(): void {
    this.router.navigate([`/test/edit/${this.testModel.id}`], { replaceUrl: true });
  }
}
