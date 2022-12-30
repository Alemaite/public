import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private loggedInSub: Subscription = Subscription.EMPTY;
  loggedIn: boolean = false;

  constructor(private authService: AuthService) {}

  logOut() {
    this.authService.logOut();
  }

  ngOnInit(): void {
    this.loggedIn = this.authService.getLoginStatus();
    this.loggedInSub = this.authService.loggedInSubj.subscribe((subStatus) => {
      this.loggedIn = subStatus;
    });
  }
  ngOnDestroy(): void {
    this.loggedInSub.unsubscribe();
  }
}
