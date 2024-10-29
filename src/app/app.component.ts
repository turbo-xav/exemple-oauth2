import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {AuthConfig, OAuthService} from 'angular-oauth2-oidc';



// https://accounts.google.com/.well-known/openid-configuration

export const authConfig: AuthConfig = {
  // Configurations spécifiques à votre provider OAuth2
  issuer: '',
  redirectUri: 'http://localhost:4200',
  clientId: '',
  responseType: 'code',
  scope: 'openid profile email',
  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  disablePKCE: true, // Activer PKCE
  dummyClientSecret:"

};

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular18';

  constructor(private readonly oauthService: OAuthService) {
    oauthService.configure(authConfig);
    oauthService.loadDiscoveryDocumentAndTryLogin().then(
      () => {
       oauthService.loadDiscoveryDocumentAndLogin()
      },
      () => {
        console.log('not logged in');
      });
    this.oauthService.events.subscribe(e => {
      if (e.type === 'token_received') {
        this.updateServiceWorkerWithToken();
      }
    });

  }

  login(): void {
    this.oauthService.initCodeFlow();
  }

  logout(): void {
    this.oauthService.logOut();
  }

  async updateServiceWorkerWithToken() {
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      const token = this.oauthService.getAccessToken();
      await navigator.serviceWorker.controller.postMessage({
        type: 'SET_TOKEN',
        token: token,
      });
    }
  }

}
