import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private url = 'users';

  constructor(private http: HttpClient) {}

  public getApplicants(): Observable<User[]> {
    return this.http.get<User[]>(`${environment.apiurl}/${this.url}`);
  }
}
