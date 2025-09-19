import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { UserService } from '../dashboard/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const requiredRoles = route.data['roles'] as Array<string>;

    return this.userService.getUserRole().pipe(
      take(1),
      map(userRole => {
        if (userRole === 'Admin') {
          return true;
        }

        const hasRequiredRole = requiredRoles.includes(userRole);

        if (hasRequiredRole) {
          return true;
        }

        return this.router.createUrlTree(['/request-error/401']);
      })
    );
  }
}
