import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ObjectId } from 'mongoose';
import { IngredientsModel } from '../models/ingredients';
import { IngredientModel } from '../models/ingredient';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  handsetMode = false;
  id: ObjectId = {} as ObjectId;
  recipe: IngredientsModel = { title: '', ingredients: [], _id: '' };
  sessionId: string | null = null;
  userId: string | null = null;
  added = false;
  duplicates: boolean | undefined = undefined;
  popUpActive = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService,
    private shoppingListService: ShoppingListService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.adminService.getRecipe(this.id);

    this.adminService.recipe.subscribe((recipe: any) => {
      this.recipe = recipe;
    });

    this.authService.userId.subscribe((userId: string) => {
      this.userId = userId;
    });

    this.shoppingListService.duplicates.subscribe((duplicates: boolean) => {
      this.duplicates = duplicates;
    });

    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId');
    }

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

  onAddItems() {
    if (this.added) {
      this.duplicates = true;
      return;
    }

    if (this.userId) {
      this.shoppingListService.addItems(this.userId, this.recipe);
      this.added = true;
      return;
    }

    this.shoppingListService.addItemsToSession(this.recipe);
    this.added = true;
  }

  confirmPopup() {
    this.duplicates = false;
    this.added = false;
  }
}
