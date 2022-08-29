import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { CognitoService } from 'app/services/cognito.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router, private cognitoService:CognitoService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let isAuth = await this.cognitoService.isAuthenticated();//this.authService.isAuthenticated();
    if (!isAuth) {
      this.router.navigate(['login']);
    }
    else {
      return true;
    }
  }
}
