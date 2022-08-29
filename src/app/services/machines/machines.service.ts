import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Machine } from '../../models/machine';
import { HttpErrorHandler, HandleError } from '../http-error-handler.service';
import {path} from '../services-config'
import { CognitoService } from '../cognito.service';
import { environment } from 'environments/environment';
import { CognitoUserPool} from 'amazon-cognito-identity-js'
import { urls } from '../serviceUrls';


const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    Authorization: 'eyJraWQiOiJJdktcL0dOQXRJQjh0SFdMdytFcktwXC8zN0RhMVdRQ3p6SlwvdTl0WWpXQ1wvST0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJjOTg2MzhjNC1lNjI4LTQxMzctYmNmMC0zMTkxMjE5ZmMyZDUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tXC91cy1lYXN0LTFfY2h6WWhWeTJvIiwiY29nbml0bzp1c2VybmFtZSI6ImM5ODYzOGM0LWU2MjgtNDEzNy1iY2YwLTMxOTEyMTlmYzJkNSIsIm9yaWdpbl9qdGkiOiI2Nzc1NjllMS1hYTliLTQ0NTgtOGVjMy0zOTlhNzg1MzlmMDEiLCJhdWQiOiIzdjlubXM1NzhmaTlzM2RmdnByaDhlZmRiaiIsImV2ZW50X2lkIjoiY2NmMTFjODMtZDg5Ni00ZDM5LThiNjMtY2ZkMTAwNmIxOTJlIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE2NTQ0NDk1NTUsIm5hbWUiOiJnZ2dpaWlkZGRkZiIsImV4cCI6MTY1NDQ1NzEwMywiaWF0IjoxNjU0NDUzNTAzLCJqdGkiOiJiNGM4ZGMyYS01NTlkLTQzZTktYTJiOC02ZjA0ZGU5ZWU1MjAiLCJlbWFpbCI6ImxvYmlzYWJvQG1haWxvLmljdSJ9.ZkrUqBz-r-VhMiQlG-WN4wADWbAWCCfZ7dzrmQbA18LC8zTqof8kLPGx37puxIiqSQ54-TBkshgqWyaRhTLVVOzpzZQgh1yELPCP6JV5To1WieSf5Oe-B4Fc_1ODTiaiLQlWFV1dvcQ7fieHP-j-yTHqiatjuoAzpjQY374hYMNJQW0ty2WuNc0nZwA5DSf3Dtjj9u_dww8hP9xr6otFWHXsug5RyXyY_WbVFJ0guhrMpiSO8DfbiKShXSZ6wGcWngrGJxQvdxKL_W7-DuIPgav0dqhyb97Fmcwz6P7oCWsweqV89BRx_zqInMqemyu5dhiqmnA_O5rWDV7PfHZhEA'
  })
};

@Injectable()
export class MachinesService {
  machinesUrl = `${path}/ApplicationIO/Machine`;  // URL to web api
  private handleError: HandleError;

  constructor(
    private http: HttpClient,
    httpErrorHandler: HttpErrorHandler,
    private cognitoService:CognitoService) {
    this.handleError = httpErrorHandler.createHandleError('MachinesService');
  }

  getMachinesObs(appId: string): Observable<Machine[]> {
    const url = `${urls.getMachineUrl}?envId=${appId}`;
    return this.http.get<Machine[]>(url, this.cognitoService.getHTTPOptions())
    .pipe(
     catchError(this.handleError('inputMachine',[]))
    )
  }


  inputMachine(machine: Machine): Promise<Machine> {
    return this.http.post<Machine>(urls.getMachineUrl, machine, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError('inputMachine', machine))
    ).toPromise();
  }

  deleteMachine(id: number): Promise<{}> {
    const url = `${urls.getMachineUrl}/${id}`;

    return this.http.delete(url, this.cognitoService.getHTTPOptions())
      .pipe(
        catchError(this.handleError('deleteMachine'))
      ).toPromise();
  }

  editMachine(machine: Machine): Promise<Machine> {
    return this.http.put<Machine>(urls.getMachineUrl, machine, this.cognitoService.getHTTPOptions())
    .pipe(
      catchError(this.handleError('editApplication', machine))
    ).toPromise();
  }

}
