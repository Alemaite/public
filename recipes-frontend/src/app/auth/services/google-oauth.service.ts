import { Injectable } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { UserInfo } from 'src/app/models/user-info';
import { oAuthConfig } from 'src/app/config/google-oauth.config';
import { Router } from '@angular/router';
import { of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GoogleOAuthService {
  constructor(private oAuthService: OAuthService, private router: Router) {
    this.oAuthService.configure(oAuthConfig);
  }

  login(): void {
    this.oAuthService.initLoginFlow();
  }

  async loadUserProfile() {
    await this.oAuthService.loadDiscoveryDocument();
    await this.oAuthService.tryLoginImplicitFlow();
    const state = await this.oAuthService.loadUserProfile();
    const userInfo: UserInfo = {
      info: {
        email: (state as UserInfo).info.email,
        name: (state as UserInfo).info.name,
        picture: (state as UserInfo).info.picture,
      },
    };
    return userInfo;
  }

  validAccessToken() {
    return this.oAuthService.hasValidAccessToken();
  }

  logOut() {
    this.oAuthService.revokeTokenAndLogout();
    this.router.navigate(['/']);
  }
}
