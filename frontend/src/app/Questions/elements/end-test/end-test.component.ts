import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-end-test',
  standalone: true,
  imports: [ButtonModule],
  templateUrl: './end-test.component.html',
  styleUrl: './end-test.component.css'
})
export class EndTestComponent {
  constructor(private router: Router){}

  public endTest() {
    this.router.navigate(['/dashboard']);
  }
}
