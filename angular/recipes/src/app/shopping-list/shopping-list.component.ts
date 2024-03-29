import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IngredientsModel } from '../models/ingredients';
import { ShoppingListService } from './shopping-list.service';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [],
})
export class ShoppingListComponent implements OnInit {
  displayedColumns: string[] = ['quantity', 'unit', 'name'];
  recipes: IngredientsModel[] = [];
  userId: string = '';

  constructor(
    private shoppingListService: ShoppingListService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    if (this.userId) {
      this.shoppingListService.getItems(this.userId);
      this.shoppingListService.shoppingList.subscribe((items: any) => {
        this.recipes = items;
      });
      return;
    }

    this.shoppingListService.getItemsFromSession();

    this.shoppingListService.shoppingListSession.subscribe(
      (recipes: IngredientsModel[]) => {
        this.recipes = recipes;
      }
    );
  }

  onDelete(recipeId: string | undefined) {
    if (this.userId) {
      this.shoppingListService.deleteItems(this.userId, recipeId);
      return;
    }

    this.shoppingListService.deleteItemsFromSession(recipeId);
  }
}
