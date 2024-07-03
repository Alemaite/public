import { createReducer, on } from '@ngrx/store';
import {
  initialRecipesListPageState,
  initialRecipesListState,
} from './recipes-list.state';
import {
  fetchRecipes,
  fetchRecipesFailure,
  fetchRecipesPage,
  fetchRecipesPageSuccess,
  fetchRecipesSuccess,
} from './recipes-list.actions';

export const recipesListReducer = createReducer(
  initialRecipesListState,
  on(fetchRecipes, (state) => ({ ...state, loading: true })),
  on(fetchRecipesSuccess, (state, { recipes }) => ({
    ...state,
    recipes,
    loading: false,
  })),
  on(fetchRecipesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);

export const recipesListPageReducer = createReducer(
  initialRecipesListPageState,
  on(fetchRecipesPage, (state) => ({ ...state, loading: true })),
  on(fetchRecipesPageSuccess, (state, { content, page, loading }) => ({
    ...state,
    content,
    page,
    loading,
  }))
);
