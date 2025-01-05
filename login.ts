import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  template: `
    <div *ngIf="!isAuthenticated">
      <button (click)="login()">Login with SSO</button>
    </div>
    <div *ngIf="isAuthenticated">
      <p>Welcome, {{ email }}</p>
      <button (click)="logout()">Logout</button>
    </div>
  `,
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuthenticated = false;
  email: string | null = null;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Check if redirected from backend with email
    const emailFromQuery = this.route.snapshot.queryParamMap.get('email');
    if (emailFromQuery) {
      this.email = emailFromQuery;
      this.isAuthenticated = true;
      localStorage.setItem('email', emailFromQuery);
    }
  }

  login() {
    // Call backend to start SSO flow
    window.location.href = 'http://localhost:3000/api/auth/login';
  }

  logout() {
    // Clear tokens and email
    localStorage.clear();
    this.isAuthenticated = false;
    this.email = null;
    this.router.navigate(['/']);
  }
}
