import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LeaveApplication } from '../models/leaveapplication';

@Injectable({
  providedIn: 'root',
})
export class LeaveApplicationService {
  private url = 'LeaveApplicationRequests';
  applications: LeaveApplication[] = [];

  constructor(private http: HttpClient) {}

  subtmitLeaveApplication(
    leaveApp: LeaveApplication
  ): Observable<LeaveApplication[]> {
    return this.http.post<LeaveApplication[]>(
      `${environment.apiurl}/${this.url}`,
      leaveApp
    );
    //this.applications.push(leaveApp);
  }

  getLeaveApplications(): Observable<LeaveApplication[]> {
    return this.http.get<LeaveApplication[]>(
      `${environment.apiurl}/${this.url}`
    );
  }
}
