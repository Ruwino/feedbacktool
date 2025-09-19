import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule, 
        RouterTestingModule.withRoutes([
          { path: 'register', component: RegisterComponent }
        ]),
        RegisterComponent,
        DropdownModule,
        ToastModule,
        NoopAnimationsModule
      ],
      providers: [MessageService]
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1: Ensure email validation works
  it('should validate email format correctly', () => {
    
    const email = 'doeffoe@hva.nl';
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue(email);
    fixture.detectChanges();

    expect(emailControl?.valid).toBeTrue();
    expect(emailControl?.errors).toBeNull();
  });

  // Test 2: Ensure the register page loads correctly
  it('should ensure the register form is visible when navigating to /register', async () => {
    
    await router.navigate(['/register']);
    fixture.detectChanges();

    const formElement = fixture.nativeElement.querySelector('form');
    expect(formElement).toBeTruthy();
    expect(formElement).toBeDefined();
  });
});