import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import 'crypto-js/lib-typedarrays'
import Amplify, { Auth } from 'aws-amplify';
import { CognitoUserPool, AuthenticationDetails } from 'amazon-cognito-identity-js'
import { HttpHeaders } from '@angular/common/http';
import { CognitoUser } from '@aws-amplify/auth';


export interface IUser {
  email: string;
  password: string;
  showPassword: boolean;
  code: string;
  name: string;
  family_name: string;
  //  username: string;
  given_name: string;
}

const poolData = {
  UserPoolId: 'us-east-1_chzYhVy2o',
  ClientId: '3v9nms578fi9s3dfvprh8efdbj'
}
const userPool = new CognitoUserPool(poolData)

@Injectable({
  providedIn: 'root',
})
export class CognitoService {


  private authenticationSubject: BehaviorSubject<any>;

  constructor() {
    Amplify.configure({
      Auth: environment.cognito
    });

    this.authenticationSubject = new BehaviorSubject<boolean>(false);
  }

  public getHTTPOptions() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: this.getToken()
      })
    };
    return httpOptions
  }

  private getToken() {
    const userPoolId = environment.cognito.userPoolId
    const clientId = environment.cognito.userPoolWebClientId
    const poolData = {
      UserPoolId: userPoolId,
      ClientId: clientId,
    }
    const userPool = new CognitoUserPool(poolData);
    var authenticatedUser = userPool.getCurrentUser();;
    let t
    authenticatedUser.getSession((err, session) => {
      const token = session.getIdToken().getJwtToken();
      t = token
    })
    return t
  }

  public signUp(user: IUser): Promise<any> {
    return Auth.signUp({
      username: user.email,
      password: user.password,
    });
  }

  public completePass(username, pass, newPassword){
    Auth.signIn(username, pass)
      .then((user) => {
        Auth.completeNewPassword(
          user,               // the Cognito User Object
          newPassword      // the new password
          // OPTIONAL, the required attributes
          
          ).then(user => {
              // at this time the user is logged in if no MFA required
              console.log(user);
          }).catch(e => {
            console.log(e);
          });
        })
  }

  public confirmSignUp(user: IUser): Promise<any> {
    return Auth.confirmSignUp(user.email, user.code);
  }

  public signIn(email, password): Promise<any> {
    return Auth.signIn(email, password)
    .then((user) => {
      this.authenticationSubject.next(true);
      return user
    })
  }

  public signOut(): Promise<any> {
    return Auth.signOut()
      .then(() => {
        this.authenticationSubject.next(false);
      });
  }

  public isAuthenticated(): Promise<boolean> {
    if (this.authenticationSubject.value) {
      return Promise.resolve(true);
    } else {
      return this.getUser()
        .then((user: any) => {
          if (user) {
            return true;
          } else {
            return false;
          }
        }).catch(() => {
          return false;
        });
    }
  }

  public getUser(): Promise<any> {
    return Auth.currentUserInfo();
  }

  public updateUser(user: IUser): Promise<any> {
    return Auth.currentUserPoolUser()
      .then((cognitoUser: any) => {
        return Auth.updateUserAttributes(cognitoUser, user);
      });
  }

  public async proba() {
    console.log(1)
    const ad = new AuthenticationDetails({ Username: 'beromi9kk956@rxcay.com', Password: ':3JoZivW' })
    console.log(2)
    const cognitoUser = new CognitoUser({ Username: 'berofdfdmi9956@rxcahjhkjhjkhjkhjkhy.com', Pool: userPool })
    console.log(3)
    await cognitoUser.authenticateUser(ad, {
      onSuccess: (result) => {
        console.log('ddd');
      },
      onFailure: (err) => {
          console.log("Authenticate user failure");
          console.log(err);
          console.log(cognitoUser)
     },
      newPasswordRequired: (userAttributes) => {
        //  delete userAttributes.email_verified;
        //  delete userAttributes.phone_number_verified;

        // userAttributes.name = authenticationDetails.username;
        // console.log(userAttributes);
        // this.setState({
        //   isFirstLogin: true,
        //   user: cognitoUser,
        //   userAttr: userAttributes
        // });
        console.log('ddd')
      }
    })
  }


}