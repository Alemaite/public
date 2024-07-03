import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RecipeState, TriggerState } from './recipe.state';
import { ReducersEnum } from 'src/app/enums/reducers.enum';

const getRecipeState = createFeatureSelector<RecipeState>(ReducersEnum.RECIPE);
const getTriggerState = createFeatureSelector<TriggerState>(
  ReducersEnum.TRIGGER
);

export const selectRecipe = createSelector(getRecipeState, (state) => state);
export const selectTrigger = createSelector(getTriggerState, (state) => state);
