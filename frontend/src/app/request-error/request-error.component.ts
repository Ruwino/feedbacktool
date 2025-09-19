import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-request-error',
  standalone: true,
  imports: [
    Button,
    RouterLink
  ],
  templateUrl: './request-error.component.html',
  styleUrl: './request-error.component.css'
})
export class RequestErrorComponent implements OnInit {
  private errorMessages: Record<number, string> = {
    401: 'Je hebt geen toegang tot deze pagina.',
    404: 'Deze pagina kan niet gevonden worden.',
    500: 'Er is iets misgegaan.'
  }

  public statusCode!: number;
  public errorMessage!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.statusCode = this.getStatusCode();
    this.errorMessage = this.getErrorMessage();
  }

  private getErrorMessage() {
    return this.errorMessages[this.statusCode] || this.errorMessages[500];
  }

  private getStatusCode(): number {
    const statusCode = this.route.snapshot.paramMap.get('statusCode');

    if (!statusCode) { return 500; }

    return parseInt(statusCode);
  }
}
