import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecipesListPageState, RecipesListState } from './recipes-list.state';
import { ReducersEnum } from 'src/app/enums/reducers.enum';

const getRecipesListState = createFeatureSelector<RecipesListState>(
  ReducersEnum.RECIPESLIST
);

const getRecipesListPageState = createFeatureSelector<RecipesListPageState>(
  ReducersEnum.RECIPESLISTPAGE
);

export const selectRecipesLabelsAndCounters = createSelector(
  getRecipesListState,
  (state) => {
    const labels = [];
    const counter = [];
    for (const recipe of state.recipes) {
      labels.push(recipe.title);
      counter.push(recipe.data.counter);
    }
    return { labels, counter };
  }
);

export const selectRecipesList = createSelector(
  getRecipesListState,
  (state) => state
);

export const selectRecipesListPage = createSelector(
  getRecipesListPageState,
  (state) => state
);
