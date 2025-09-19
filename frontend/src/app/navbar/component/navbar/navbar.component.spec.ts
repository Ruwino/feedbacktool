import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import {HttpClientModule} from "@angular/common/http";

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent, MenubarModule, ButtonModule, HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: { params: of({}) } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;

    // shouldShowNavbar should return true so that the tests pass
    spyOn(component, 'shouldShowNavbar').and.returnValue(true);

    fixture.detectChanges();
  });

  it('should render the navigation menu', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('nav')).toBeTruthy();
  });

  it('should render the logout button', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('button[pButton]')).toBeTruthy();
  });
});
