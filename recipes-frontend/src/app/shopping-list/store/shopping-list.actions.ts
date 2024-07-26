import { createAction, props } from '@ngrx/store';
import { Recipe } from 'src/app/models/recipe';
import { HttpErrorResponse } from '@angular/common/http';

export const componentName = '[Shopping List]';

export const increaseRecipeCounter = createAction(
  `${componentName} Increase Recipe Counter`,
  props<{ recipe: Recipe }>()
);

export const increaseRecipeCounterSuccess = createAction(
  `${componentName} Increase Recipe Counter Success`,
  props<{ recipe: Recipe }>()
);

export const increaseRecipeCounterFailure = createAction(
  `${componentName} Increase Recipe Counter Failure`,
  props<{ error: HttpErrorResponse }>()
);

export const fetchRecipesFromLocalStorage = createAction(
  `${componentName} Fetch Recipes From Local Storage`
);

export const fetchRecipesFromLocalStorageSuccess = createAction(
  `${componentName} Fetch Recipes From Local Storage Success`,
  props<{ recipes: Recipe[] }>()
);

export const fetchRecipesFromLocalStorageFailure = createAction(
  `${componentName} Fetch Recipes From Local Storage Failure`,
  props<{ error: Error }>()
);

export const addRecipeToLocalStorage = createAction(
  `${componentName} Add Recipe To Local Storage`,
  props<{ recipe: Recipe }>()
);

export const addRecipeToLocalStorageSuccess = createAction(
  `${componentName} Add Recipe To Local Storage Success`,
  props<{ recipes: Recipe[] }>()
);

export const addRecipeToLocalStorageFailure = createAction(
  `${componentName} Add Recipe To Local Storage Failure`,
  props<{ error: Error }>()
);

export const deleteRecipesFromLocalStorage = createAction(
  `${componentName} Delete Recipes From Local Storage`,
  props<{ recipes: Recipe[] }>()
);

export const deleteRecipesFromLocalStorageSuccess = createAction(
  `${componentName} Delete Recipes From Local Storage Success`,
  props<{ recipes: Recipe[] }>()
);

export const deleteRecipesFromLocalStorageFailure = createAction(
  `${componentName} Delete Recipes From Local Storage Failure`,
  props<{ error: Error }>()
);
