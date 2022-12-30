import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AuthService } from './auth.service';

import { User } from './user.model';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  loginMode = true;
  msgObj = {
    hasMsg: false,
    message: '',
  };
  msgSub: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.msgSub = this.authService.msgSubj.subscribe((error) => {
      this.msgObj = {
        hasMsg: true,
        message: error,
      };
    });
  }

  onSubmit(authForm: NgForm) {
    if (authForm.form.controls['email'].invalid) {
      this.msgObj = {
        hasMsg: true,
        message: 'E-Mail invalid',
      };
      return;
    }
    if (authForm.form.controls['password'].invalid) {
      this.msgObj = {
        hasMsg: true,
        message: 'Password must be at least 6 characters long',
      };
      return;
    }
    const user: User = {
      email: authForm.value.email,
      password: authForm.value.password,
    };
    if (this.loginMode) {
      return this.authService.loginUser(user);
    }
    return this.authService.createUser(user);
  }

  onSwitchMode() {
    return (this.loginMode = !this.loginMode);
  }

  ngOnDestroy(): void {
    this.msgSub.unsubscribe();
  }
}
