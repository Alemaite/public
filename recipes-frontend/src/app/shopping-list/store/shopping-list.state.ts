import { Recipe } from 'src/app/models/recipe';

export interface ShoppingListState {
  recipes: Recipe[];
}

export const shoppingListInitialState: ShoppingListState = {
  recipes: [],
};
