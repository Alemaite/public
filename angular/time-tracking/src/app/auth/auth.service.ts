import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ActivityService } from '../main/activity.service';
import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedInSubj = new Subject<boolean>();
  emailSubj = new Subject<string | undefined>();
  msgSubj = new Subject<string>();

  constructor(
    private http: HttpClient,
    private router: Router,
    private activityService: ActivityService
  ) {}

  loginUser(user: User) {
    this.http
      .post<{ message: string; email?: string | undefined; _id?: string }>(
        'https://iu-time-tracking.click/api/users/login',
        user
      )
      .subscribe(
        (response) => {
          this.saveAuthData(response._id, response.email);
          const loggedIn = this.getLoginStatus();
          this.loggedInSubj.next(loggedIn);
          const email = this.getLoggedInEmail();
          this.emailSubj.next(email);
          this.router.navigate(['/']);
        },
        (error) => {
          this.msgSubj.next(error.error.message);
        }
      );
  }

  private saveAuthData(_id?: string, email?: string | undefined) {
    localStorage.setItem('loggedIn', 'true');
    if (_id) {
      localStorage.setItem('_id', _id);
    }
    if (email) {
      localStorage.setItem('email', email);
    }
  }

  getLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    if (loggedIn) {
      return true;
    }
    return false;
  }

  getLoggedInEmail() {
    const email = localStorage.getItem('email');
    if (email) {
      return email;
    }
    return undefined;
  }

  getLoggedInUserId() {
    const userId = localStorage.getItem('_id');
    if (userId) {
      return userId;
    }
    return undefined;
  }

  logOut() {
    this.clearAuthData();
    const loggedIn = this.getLoginStatus();
    const email = this.getLoggedInEmail();
    this.loggedInSubj.next(loggedIn);
    this.emailSubj.next(email);
  }

  private clearAuthData() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('_id');
    localStorage.removeItem('email');
  }

  createUser(user: User) {
    this.http
      .post<{ message: string }>(
        'https://iu-time-tracking.click/api/users/register',
        user
      )
      .subscribe(
        (success) => {
          this.msgSubj.next(success.message);
        },
        (error) => {
          this.msgSubj.next(error.error.message);
        }
      );
  }
}
