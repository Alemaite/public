import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { Recipe } from 'src/app/models/recipe';
import { Page } from 'src/app/models/page';

const componentName = '[Recipes List]';

export const fetchRecipes = createAction(
  `${componentName} Fetch Recipes`,
  props<{ loading: boolean }>()
);

export const fetchRecipesSuccess = createAction(
  `${componentName} Fetch Recipes Success`,
  props<{ recipes: Recipe[] }>()
);

export const fetchRecipesFailure = createAction(
  `${componentName} Fetch Recipes Failure`,
  props<{ error: HttpErrorResponse }>()
);

export const fetchRecipesPage = createAction(
  `${componentName} Fetch Recipes Page`,
  props<{ page: number; size: number; search: string; loading: boolean }>()
);

export const fetchRecipesPageSuccess = createAction(
  `${componentName} Fetch Recipes Page Success`,
  props<{ content: Recipe[]; page: Page; loading: boolean }>()
);

export const fetchRecipesPageFailure = createAction(
  `${componentName} Fetch Recipes Page Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const updateRecipe = createAction(
  `${componentName} Update Recipe`,
  props<{ recipe: Recipe }>()
);

export const updateRecipeSuccess = createAction(
  `${componentName} Update Recipe Success`,
  props<{ recipe: Recipe }>()
);

export const updateRecipeFailure = createAction(
  `${componentName} Update Recipe Failure`,
  props<{ error: HttpErrorResponse }>()
);

export const updateRecipeFrontendOnly = createAction(
  `${componentName} Update Recipe Frontend Only`,
  props<{ recipe: Recipe }>()
);

export const updateRecipeFrontendOnlySuccess = createAction(
  `${componentName} Update Recipe Frontend Only Success`,
  props<{ recipe: Recipe }>()
);

export const updateRecipeFrontendOnlyFailure = createAction(
  `${componentName} Update Recipe Frontend Only Failure`,
  props<{ error: string }>()
);

export const createRecipe = createAction(
  `${componentName} Create Recipe`,
  props<{ recipe: Recipe }>()
);

export const createRecipeSuccess = createAction(
  `${componentName} Create Recipe Success`,
  props<{ recipe: Recipe }>()
);

export const createRecipeFailure = createAction(
  `${componentName} Create Recipe Failure`,
  props<{ error: HttpErrorResponse }>()
);

export const createRecipeFrontendOnly = createAction(
  `${componentName} Create Recipe Frontend Only`,
  props<{ recipe: Recipe }>()
);

export const createRecipeFrontendOnlySuccess = createAction(
  `${componentName} Create Recipe Frontend Only Success`,
  props<{ recipe: Recipe }>()
);

export const createRecipeFrontendOnlyFailure = createAction(
  `${componentName} Create Recipe Frontend Only Failure`,
  props<{ error: string }>()
);

export const deleteRecipes = createAction(
  `${componentName} Delete Recipes`,
  props<{ ids: string[] }>()
);

export const deleteRecipesSuccess = createAction(
  `${componentName} Delete Recipes Success`,
  props<{ ids: string[] }>()
);

export const deleteRecipesFailure = createAction(
  `${componentName} Delete Recipes Failure`,
  props<{ error: HttpErrorResponse }>()
);
