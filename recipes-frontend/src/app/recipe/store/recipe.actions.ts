import { createAction, props } from '@ngrx/store';
import { Recipe } from 'src/app/models/recipe';
import { HttpErrorResponse } from '@angular/common/http';

export const componentName = '[Recipe]';

export const fetchRecipeById = createAction(
  `${componentName} Fetch Recipe By Id`,
  props<{ id: string }>()
);

export const fetchRecipeByIdSuccess = createAction(
  `${componentName} Fetch Recipe By Id Success`,
  props<{ recipe: Recipe }>()
);

export const fetchRecipeByIdFailure = createAction(
  `${componentName} Fetch Recipe By Id Failure`,
  props<{ error: HttpErrorResponse }>()
);

export const addRecipeTrigger = createAction(
  `${componentName} Add Recipe Trigger`,
  props<{ trigger: boolean }>()
);
