import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ShoppingListModel } from '../models/shopping-list';
import { IngredientsModel } from '../models/ingredients';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  shoppingList = new Subject<ShoppingListModel>();

  constructor(private http: HttpClient) {}

  addItems(userId: string | null, items: IngredientsModel) {
    this.http
      .post('https://iu-recipes.click/api/' + userId + '/shopping-list', items)
      .subscribe(() => {});
  }

  getItems(userId: string) {
    this.http
      .get('https://iu-recipes.click/api/' + userId + '/shopping-list')
      .subscribe((response: any) => {
        this.shoppingList.next(response.items);
      });
  }

  deleteItems(userId: string, recipeId: string) {
    this.http
      .post(
        'https://iu-recipes.click/api/' +
          userId +
          '/shopping-list/' +
          recipeId +
          '/delete',
        recipeId
      )
      .subscribe((response: any) => {
        this.getItems(userId);
      });
  }
}
