# PracticeCode

//sso code for azure
import { Component, OnInit } from '@angular/core';
import { PublicClientApplication, AuthenticationResult, RedirectRequest } from '@azure/msal-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  msalInstance: PublicClientApplication;

  constructor(private router: Router) {
    // Initialize MSAL instance with your app's details
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: 'your-client-id',  // Your MS app's client ID
        authority: 'https://login.microsoftonline.com/your-tenant-id',  // Your MS tenant
        redirectUri: 'http://localhost:4200/login',  // The URL to redirect after login
      },
    });
  }

  ngOnInit(): void {
    // Check if the user was redirected back with the authorization code
    this.handleRedirectCallback();
  }

  // Start login process
  login() {
    const loginRequest: RedirectRequest = {
      scopes: ['openid', 'profile', 'User.Read'], // Scopes you want to request
    };

    // Redirect to the MS login page
    this.msalInstance.loginRedirect(loginRequest);
  }

  // Handle the redirect callback after successful login
  handleRedirectCallback() {
    this.msalInstance.handleRedirectPromise().then((response: AuthenticationResult | null) => {
      if (response) {
        // Successfully authenticated, handle token response
        console.log('Access Token:', response.accessToken);
        console.log('ID Token:', response.idToken);
        console.log('Email:', response.account?.username);

        // Store tokens in localStorage
        localStorage.setItem('access_token', response.accessToken);
        localStorage.setItem('email', response.account?.username || '');

        // Redirect to home page after successful login
        this.router.navigate(['/home']);  // Using Angular Router to navigate
      }
    }).catch(error => {
      console.error(error);
    });
  }
}
