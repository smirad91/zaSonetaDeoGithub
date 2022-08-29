import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from 'app/models/environments';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CognitoService } from '../cognito.service';
import { HandleError, HttpErrorHandler } from '../http-error-handler.service';
import { urls } from '../serviceUrls';

@Injectable({
  providedIn: 'root'
})
export class EnvsService {
  private handleError: HandleError;

  constructor(private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private cognitoService: CognitoService) { 
    this.handleError = httpErrorHandler.createHandleError('ApplicationsService');

  }

  getEnvs(appId:string): Observable<Environment[]> {
    const url = `${urls.getEnvs}?appId=${appId}`;
    return this.http.get<Environment[]>(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError('getApplications', []))
      );
  }

  getUsagePlans(): Promise<any[]> {
    const url = `${urls.getUsagePlans}`;
    return this.http.get<any[]>(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError('getApplications', []))
      ).toPromise();
  }

  editEnvs(env: Environment): Promise<Environment> {
    return this.http.put<Environment>(urls.getEnvs, env, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError('editApplication', env))
    ).toPromise()
  }

  addEnvs(env: Environment): Promise<Environment> {
    console.log('pozvao')
    return this.http.post<Environment>(urls.getEnvs, env, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError('inputApp', env))
    ).toPromise();
  }

  deleteEnv(id: string): Promise<{}> {
    const url = `${urls.getEnvs}/${id}`;
    return this.http.delete(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError('deleteMachine'))
      ).toPromise();
  }

  reloadKey(id:string): any{
    // return this.http.put<Environment>(urls.getEnvs, env, this.cognitoService.getHTTPOptions())
    // .pipe(
    //   catchError(this.handleError('editApplication', env))
    // ).toPromise()
  }
}
