import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { LoginComponent } from './login.component';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        HttpClientTestingModule,
      ],
      providers: [
        LoginService
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should give the appropriate error message when input fields are empty', () => {
    component.email = '';
    component.password = '';
  
    component.onSubmit();
    fixture.detectChanges();
  
    const errorParagraph: HTMLElement = fixture.nativeElement.querySelector('#error');
    expect(errorParagraph.textContent).toContain('Please fill in a valid email & password!');
  });

  it('should give the appropriate error message when an email is the incorrect format', () => {
    component.email = 'invalid';
    component.password = 'password';
  
    component.onSubmit();
    fixture.detectChanges();
  
    const errorParagraph: HTMLElement = fixture.nativeElement.querySelector('#error');
    expect(errorParagraph.textContent).toContain('Please fill in a valid email & password!');
  });
});
