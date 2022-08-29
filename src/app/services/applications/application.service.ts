import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppEnv } from 'app/models/appEnv';
import { Application } from 'app/models/application';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CognitoService } from '../cognito.service';
import { urls } from '../serviceUrls';


@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private handleError(error:any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
        return errorMessage;
    });
  }
  constructor(private http: HttpClient,
    private cognitoService: CognitoService) { 
 //     this.handleError = httpErrorHandler.createHandleError('ApplicationsService');
    }

  async getDefaultApplication(): Promise<Application> {
    const apps = await this.http.get<Application[]>(urls.getApplicationUrl, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      ).toPromise();
    return apps[0]
  }

  async getDefaultAE(): Promise<AppEnv> {
    const url = `${urls.getAppEnv}`;
    const apps = await this.http.get<AppEnv[]>(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      ).toPromise();
    return apps[0]
  }

  getAE(): Observable<any[]> {
    console.log('get sve aplikacije')
    const url = `${urls.getAppEnv}`;
    return this.http.get<any[]>(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplications(): Promise<Application[]> {
    return this.http.get<Application[]>(urls.getApplicationUrl, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      ).toPromise();
  }

  getApplicationsObs(): Observable<Application[]> {
    console.log('pozvan app service get obs')
    return this.http.get<Application[]>(urls.getApplicationUrl, this.cognitoService.getHTTPOptions())//.toPromise();
  }

  getApplication(appId:string): Observable<Application[]> {
    const url = `${urls.getApplicationUrl}/${appId}`;
    return this.http.get<Application[]>(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      );
  }

  getApplicationByName(name:string): Observable<Application[]> {
    const url = `${urls.getApplicationUrl}"?name="${name}`;
    return this.http.get<Application[]>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  setApplicationStatus(appId, statusId): Observable<Application> { //!!!!!
    return this.http.get<Application>(urls.getApplicationUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  inputApp(app: Application): Promise<any> {
    return this.http.post<Application>(urls.getApplicationUrl, app, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError)
    ).toPromise();
  }

  deleteApplication(id: number): Promise<{}> {
    // const url = `${urls.getApplicationUrl}?id=${id}`;
    const url = `${urls.getApplicationUrl}/${id}`;

    return this.http.delete(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError)
      ).toPromise();
  }

  editApplication(app: Application): Promise<Application> {
    return this.http.put<Application>(urls.getApplicationUrl, app, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError)
    ).toPromise()
  }
}
