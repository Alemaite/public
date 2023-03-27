import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  adminStatus: boolean = false;
  loginStatus = false;
  userId: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.loginStatus.subscribe((status: any) => {
      this.loginStatus = status;
    });
    this.authService.isAdmin.subscribe((status: any) => {
      this.adminStatus = status;
    });
    this.authService.userId.subscribe((userId: string) => {
      this.userId = userId;
    });
    if (localStorage.getItem('isAdmin') === 'true') {
      this.adminStatus = true;
    }
    if (localStorage.getItem('loginStatus') === 'true') {
      this.loginStatus = true;
    }
    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId');
    }
  }

  onLogOut() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('userId');
    this.adminStatus = false;
    this.loginStatus = false;
    this.userId = null;
    this.router.navigate(['/']);
    return;
  }
}
