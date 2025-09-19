import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginModel } from '../../models/LoginModel';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public email = "";
  public password = "";
  public errorMessage = "";
  public hasError = false;

  constructor(private loginService: LoginService, private router: Router) {}

  public onSubmit(): void {
    if(this.validateUserInput(this.email, this.password)) {
      this.login(this.email, this.password);
    }
  }

  private login(email: string, password: string): void {
    const loginData: LoginModel = new LoginModel(email, password);
    this.loginService.login(loginData).subscribe({
      next: () => {
        this.clearError();
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.displayError(error.message);
      }
    });
  }

  private validateUserInput(email: string, password: string) {
    if(email === ""|| password === "" || !this.checkEmailRegex(email)) {
      this.displayError("Please fill in a valid email & password!");
      return false;
    }
    this.clearError();
    return true;
  }

  private checkEmailRegex(email: string): boolean {
    const emailRegex = /^[\w-]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailRegex.test(email);
  }

  private displayError(error: string): void {
    this.errorMessage = error;
    this.hasError = true;
  }

  private clearError(): void {
    this.errorMessage = '';
    this.hasError = false;
  }
}
