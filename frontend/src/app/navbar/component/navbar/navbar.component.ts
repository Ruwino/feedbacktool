import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenubarModule } from "primeng/menubar";
import { ButtonModule } from "primeng/button";
import { RippleModule } from "primeng/ripple";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import { Router, NavigationEnd } from "@angular/router";
import { NavigationItem } from "../../models/NavigationModels";
import { UserService } from "../../../dashboard/services/user.service";
import { NavigationService } from "../../services/navigation.service";
import { filter, Subscription } from "rxjs";

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  imports: [
    MenubarModule,
    ButtonModule,
    RippleModule,
    NgOptimizedImage,
    NgIf,
    NgForOf
  ],
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  userRole: string = '';
  navigationItems: NavigationItem[] = [];
  private routerSubscription: Subscription | undefined;

  constructor(
    private router: Router,
    private userService: UserService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    this.loadUserRoleAndNavigation();
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.loadUserRoleAndNavigation();
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  loadUserRoleAndNavigation(): void {
    if (!this.router.url.includes('/login') && !this.router.url.includes('/register')) {
      this.userService.getUserRole().subscribe(
        role => {
          this.userRole = role;
          this.navigationItems = this.navigationService.getNavigationItemsForRole(role);
        },
        error => {
          console.error('Error fetching user role:', error);
          if (!this.router.url.includes('/login') && !this.router.url.includes('/register')) {
            this.router.navigate(['/login']);
          }
        }
      );
    } else {
      this.navigationItems = [];
    }
  }

  public shouldShowNavbar(): boolean {
    const url = this.router.url;
    // Making sure the navbar isn't shown on ANY of pages where tests are being made by students
    const testTakePattern = /^\/test\/take\/\d+/;

    return (
      url !== '/login' &&
      url !== '/register' &&
      !testTakePattern.test(url)
    );
  }
}
