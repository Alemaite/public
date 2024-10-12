import { AuthConfig } from 'angular-oauth2-oidc';
import { environment } from 'src/environments/environment';
import { clientId } from '../config/google-oauth-client-id'

export const oAuthConfig: AuthConfig = {
  issuer: 'https://accounts.google.com',
  strictDiscoveryDocumentValidation: false,
  redirectUri: environment.localUrl + '/profile',
  clientId: clientId,
  postLogoutRedirectUri: environment.localUrl,
  scope: 'openid profile email',
};
