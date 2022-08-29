import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { FullCurrentInfo } from 'app/models/fullCurrentInfoInBegining';
import { CognitoService, IUser } from 'app/services/cognito.service';
import { AuthService } from 'app/shared/auth/auth.service';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})

export class LoginPageComponent {
  user: IUser;
  loginFormSubmitted = false;
  isLoginFailed = false;
  completeNewPass = false;

  loginForm = new FormGroup({
    username: new FormControl("lobisabo@mailo.icu", [Validators.required]),//beromi9956@rxcay.com
    password: new FormControl("Smiljana666$", [Validators.required]),//:3JoZivW
    newPass: new FormControl(""),
    newPass2: new FormControl(""),
    rememberMe: new FormControl(true)
  });


  constructor(private router: Router, private authService: AuthService,
    private cognitoService: CognitoService,) {
    this.user = {} as IUser;
  }

  get lf() {
    return this.loginForm.controls;
  }

  // On submit button click
  onSubmit() {
    this.loginFormSubmitted = true;
    if (this.loginForm.invalid) {
      return;
    }

    this.user.email = this.loginForm.value.username
    this.user.password = this.loginForm.value.password
    this.cognitoService.signIn(this.loginForm.value.username, this.loginForm.value.password).then((user) => {
        console.log(user)
        if (user.challengeName === 'NEW_PASSWORD_REQUIRED' && this.completeNewPass){
          this.cognitoService.completePass(this.loginForm.value.username, this.loginForm.value.password,this.loginForm.value.newPass)
          this.router.navigate(['/page/machines']);
        }
        else if (user.challengeName === 'NEW_PASSWORD_REQUIRED' && !this.completeNewPass) {
          this.completeNewPass=true
        } else {
          console.log('nakon login')
          console.log(FullCurrentInfo.currentApp)
          this.router.navigate(['/page/machines']);
          FullCurrentInfo.username = user.attributes.email
          console.log(FullCurrentInfo.username)
        }
        this.isLoginFailed = false;
      }).catch((err) => {
        console.log('signin problem')
        this.isLoginFailed = true;
      });
  }

  async ngOnInit() {
    var authenticatedUser = await this.cognitoService.isAuthenticated();
    if (authenticatedUser == false) {
      return;
    }
    this.router.navigate(['/page/machines']);

  }


}
