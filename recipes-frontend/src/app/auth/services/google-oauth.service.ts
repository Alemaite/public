import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserInfo } from 'src/app/models/user-info';
import { oAuthConfig } from 'src/app/config/google-oauth.config';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GoogleOAuthService {
  constructor(private oAuthService: OAuthService, private router: Router) {
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

  loadUserProfile() {
    if (this.validAccessToken()) {
      return this.oAuthService.loadUserProfile() as Promise<UserInfo>;
    }
    return Promise.reject('Token not valid. Please login again.');
  }

  validAccessToken() {
    return this.oAuthService.hasValidAccessToken();
  }

  logOut() {
    this.oAuthService.revokeTokenAndLogout();
    this.router.navigate(['/']);
  }
}
