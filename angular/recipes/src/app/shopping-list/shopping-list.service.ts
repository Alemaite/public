import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { ShoppingListModel } from '../models/shopping-list';
import { IngredientsModel } from '../models/ingredients';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
  shoppingList = new Subject<ShoppingListModel>();
  shoppingListSession = new Subject<IngredientsModel[]>();
  duplicates = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  // requests below if not logged in
  getItemsFromSession() {
    this.http
      .get<{ message: string; result: IngredientsModel[] }>(
        'https://iu-recipes.click/api/shopping-list'
      )
      .subscribe(
        (response: { message: string; result: IngredientsModel[] }) => {
          this.shoppingListSession.next(response.result);
        }
      );
  }

  addItemsToSession(items: IngredientsModel) {
    this.http
      .post<{ message: string; duplicates: boolean }>(
        'https://iu-recipes.click/api/shopping-list',
        items
      )
      .subscribe((response: { message: string; duplicates: boolean }) => {
        this.duplicates.next(response.duplicates);
        this.getItemsFromSession();
      });
  }

  deleteItemsFromSession(recipeId: string | undefined) {
    this.http
      .post<{ message: string }>(
        'https://iu-recipes.click/api/shopping-list/' + recipeId + '/delete/',
        recipeId
      )
      .subscribe(() => {
        this.getItemsFromSession();
      });
  }

  // all requests below if logged in
  addItems(userId: string, items: IngredientsModel) {
    this.http
      .post('https://iu-recipes.click/api/' + userId + '/shopping-list', items)
      .subscribe((response: any) => {
        this.duplicates.next(response.duplicates);
        this.getItems(userId);
      });
  }

  getItems(userId: string) {
    this.http
      .get('https://iu-recipes.click/api/' + userId + '/shopping-list')
      .subscribe((response: any) => {
        this.shoppingList.next(response.items);
      });
  }

  deleteItems(userId: string, recipeId: string | undefined) {
    this.http
      .post(
        'https://iu-recipes.click/api/' +
          userId +
          '/shopping-list/' +
          recipeId +
          '/delete',
        recipeId
      )
      .subscribe(() => {
        this.getItems(userId);
      });
  }
}
