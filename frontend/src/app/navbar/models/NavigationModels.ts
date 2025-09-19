import { UserRole } from "../enums/userRoles";

export class NavigationItem {
  private _label: string;
  private _route: string;
  private allowedRoles: UserRole[];

  constructor(
    label: string,
    route: string,
    allowedRoles: UserRole[] = [UserRole.Admin, UserRole.Teacher, UserRole.Student]
  ) {
    this._label = label;
    this._route = route;
    this.allowedRoles = allowedRoles;
  }

  get label(): string {
    return this._label;
  }

  get route(): string {
    return this._route;
  }

  isVisibleForRole(userRole: UserRole): boolean {
    return this.allowedRoles.includes(userRole);
  }
}
