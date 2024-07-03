import { Recipe } from 'src/app/models/recipe';

export interface RecipeState {
  recipe?: Recipe;
  loading: boolean;
}

export interface TriggerState {
  trigger: boolean;
}

export const initialRecipeState: RecipeState = {
  recipe: undefined,
  loading: false,
};

export const initialTriggerState = {
  trigger: false,
};
