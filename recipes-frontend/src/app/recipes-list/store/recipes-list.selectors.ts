import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecipesListPageState, RecipesListState } from './recipes-list.state';
import { ReducersEnum } from 'src/app/enums/reducers.enum';

const getRecipesListState = createFeatureSelector<RecipesListState>(
  ReducersEnum.RECIPESLIST
);

const getRecipesListPageState = createFeatureSelector<RecipesListPageState>(
  ReducersEnum.RECIPESLISTPAGE
);

export const selectRecipesList = createSelector(
  getRecipesListState,
  (state) => state
);

export const selectRecipesListPage = createSelector(
  getRecipesListPageState,
  (state) => state
);
