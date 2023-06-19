import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/user';
import { Subject } from 'rxjs';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  public errorMessage = new Subject();
  public successMessage = new Subject();
  public loginStatus = new Subject();
  public isAdmin = new Subject<boolean>();
  public userId = new Subject<string>();

  constructor(
    private http: HttpClient,
    private shoppingListService: ShoppingListService
  ) {}

  createUser(user: UserModel) {
    this.http
      .post<{ message: string; user: UserModel }>(
        'https://iu-recipes.click/api/users',
        user
      )
      .subscribe(
        (response) => {
          return this.successMessage.next(response.message);
        },
        (response) => {
          return this.errorMessage.next(response.error.message);
        }
      );
  }

  loginUser(user: UserModel) {
    this.http
      .post<{ message: string; user: { isAdmin?: boolean; _id: string } }>(
        'https://iu-recipes.click/api/users/login',
        user
      )
      .subscribe(
        (response) => {
          localStorage.setItem('loginStatus', 'true');
          localStorage.setItem('isAdmin', 'false');
          localStorage.setItem('userId', response.user._id);
          this.userId.next(response.user._id);
          this.loginStatus.next(true);
          this.shoppingListService.getItems(response.user._id);
          if (response.user.isAdmin) {
            localStorage.setItem('isAdmin', 'true');
            this.isAdmin.next(response.user.isAdmin);
            return;
          }
          return;
        },
        (response) => {
          this.errorMessage.next(response.error.message);
          return;
        }
      );
  }
}
