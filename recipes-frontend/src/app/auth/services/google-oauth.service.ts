import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';
import { UserInfo } from 'src/app/models/user-info';
import { oAuthConfig } from 'src/app/config/google-oauth.config';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { createUserIfDoesNotExist } from '../store/auth.actions';
import { Router } from '@angular/router';
import { catchError, map } from 'rxjs/operators';
import { from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleOAuthService {
  userBS = new BehaviorSubject<UserInfo | null>(null);
  user$ = this.userBS.asObservable();

  constructor(
    private oAuthService: OAuthService,
    private store: Store,
    private router: Router
  ) {
    this.oAuthService.configure(oAuthConfig);
    this.oAuthService
      .loadDiscoveryDocument()
      .then(() =>
        this.oAuthService
          .tryLoginImplicitFlow()
          .then(() => this.loadUserProfile())
      );
  }

  login(): void {
    this.oAuthService.initLoginFlow();
  }

  loadUserProfile(): Observable<UserInfo | null> {
    if (this.oAuthService.hasValidAccessToken()) {
      return from(this.oAuthService.loadUserProfile()).pipe(
        map((userInfo) => {
          const userAsUserInfo = userInfo as UserInfo;
          if (userAsUserInfo.info.email && userAsUserInfo.info.name) {
            const user = new User(
              userAsUserInfo.info.name,
              userAsUserInfo.info.email
            );
            // adds user to db if not already there
            this.store.dispatch(
              createUserIfDoesNotExist({
                fullName: user.fullName,
                email: user.email,
                loading: true,
              })
            );
          }
          return userAsUserInfo;
        }),
        catchError(() => of(null))
      );
    }
    return of(null);
  }

  validAccessToken() {
    return this.oAuthService.hasValidAccessToken();
  }

  logOut() {
    this.oAuthService.revokeTokenAndLogout();
    this.router.navigate(['/']);
  }
}
