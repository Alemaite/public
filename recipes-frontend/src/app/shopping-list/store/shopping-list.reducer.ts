import { createReducer, on } from '@ngrx/store';
import { shoppingListInitialState } from './shopping-list.state';
import {
  addRecipeToLocalStorageSuccess,
  deleteRecipesFromLocalStorageSuccess,
  fetchRecipesFromLocalStorageSuccess,
} from './shopping-list.actions';

export const shoppingListReducer = createReducer(
  shoppingListInitialState,
  on(addRecipeToLocalStorageSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
  })),
  on(fetchRecipesFromLocalStorageSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
  })),
  on(deleteRecipesFromLocalStorageSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
  }))
);
