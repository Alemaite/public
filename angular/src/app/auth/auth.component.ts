import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserModel } from '../models/user';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  loginMode = true;
  isAdmin = false;
  loginStatus = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.isAdmin.subscribe((status: boolean) => {
      this.isAdmin = status;
    });

    this.authService.loginStatus.subscribe((status: any) => {
      this.loginStatus = status;
    });

    this.authService.errorMessage.subscribe((message: any) => {
      this.errorMessage = message;
      this.successMessage = '';
    });

    this.authService.successMessage.subscribe((message: any) => {
      this.successMessage = message;
      this.errorMessage = '';
      this.loginMode = true;
    });
  }

  onAuthToggle() {
    this.loginMode = !this.loginMode;
    return;
  }

  onSubmit(authForm: NgForm) {
    const user: UserModel = {
      name: authForm.value.name,
      password: authForm.value.password,
    };
    if (this.loginMode) {
      this.authService.loginUser(user);
      this.router.navigate(['/']);
      return;
    }
    this.authService.createUser(user);
    return;
  }
}
