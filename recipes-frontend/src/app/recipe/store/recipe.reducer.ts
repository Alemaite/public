import { createReducer, on } from '@ngrx/store';
import { initialRecipeState, initialTriggerState } from './recipe.state';
import { addRecipeTrigger, fetchRecipeById } from './recipe.actions';
import { fetchRecipeByIdSuccess } from './recipe.actions';

export const recipeReducer = createReducer(
  initialRecipeState,
  on(fetchRecipeById, (state) => ({ ...state, loading: true })),
  on(fetchRecipeByIdSuccess, (state, { recipe }) => ({
    ...state,
    recipe,
    loading: false,
  }))
);

export const triggerReducer = createReducer(
  initialTriggerState,
  on(addRecipeTrigger, (state, { trigger }) => ({ ...state, trigger }))
);
