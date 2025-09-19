import {Injectable} from '@angular/core';
import {NavigationItem} from '../models/NavigationModels';
import {UserRole} from "../enums/userRoles";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private navigationItems: NavigationItem[] = [
    new NavigationItem('Dashboard', '/dashboard', [UserRole.Admin, UserRole.Teacher, UserRole.Student]),
    new NavigationItem('Cijfer overzicht', '/grades', [UserRole.Admin, UserRole.Student]),
    new NavigationItem('Klas toevoegen', '/class/add', [UserRole.Admin, UserRole.Teacher]),
    new NavigationItem('Toets overzicht', '/test/overview', [UserRole.Admin, UserRole.Student]),
    new NavigationItem('Studenten overzicht', '/students/overview', [UserRole.Admin, UserRole.Teacher])
  ];

  getNavigationItemsForRole(role: UserRole): NavigationItem[] {
    return this.navigationItems.filter(item => item.isVisibleForRole(role));
  }
}
