import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ObjectId } from 'mongoose';
import { IngredientsModel } from '../models/ingredients';
import { IngredientModel } from '../models/ingredient';
import { AdminService } from '../admin/admin.service';
import { AuthService } from '../auth/auth.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Component({
  selector: 'app-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: ['./recipes.component.css'],
})
export class RecipesComponent implements OnInit {
  id: ObjectId = {} as ObjectId;
  recipe: IngredientsModel = { title: '', ingredients: [] };
  userId: string | null = null;
  added = false;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private adminService: AdminService,
    private shoppingListService: ShoppingListService
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
    if (localStorage.getItem('userId')) {
      this.userId = localStorage.getItem('userId');
    }
  }

  onAddItems() {
    this.shoppingListService.addItems(this.userId, this.recipe);
    this.added = true;
    return;
  }
}
