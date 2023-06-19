import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { IngredientsModel } from '../models/ingredients';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  handsetMode = false;
  adminStatus: boolean = false;
  loginStatus = false;
  userId: string | null = null;
  recipesAdded: number | undefined = undefined;

  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService,
    private router: Router,
    private responsive: BreakpointObserver
  ) {}

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

    if (this.userId) {
      this.shoppingListService.getItems(this.userId);
    }

    this.shoppingListService.shoppingList.subscribe((recipes: any) => {
      if (recipes) {
        this.recipesAdded = recipes.length;
      }
    });

    if (!this.userId) {
      this.shoppingListService.getItemsFromSession();
    }
    this.shoppingListService.shoppingListSession.subscribe(
      (recipes: IngredientsModel[]) => {
        if (recipes) {
          this.recipesAdded = recipes.length;
        }
      }
    );

    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
        return;
      });
  }

  onLogOut() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('loginStatus');
    localStorage.removeItem('userId');
    this.adminStatus = false;
    this.loginStatus = false;
    this.userId = null;
    this.shoppingListService.getItemsFromSession();
    this.router.navigate(['/']);
    return;
  }
}
