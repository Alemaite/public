import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addRecipeToLocalStorage,
  addRecipeToLocalStorageFailure,
  addRecipeToLocalStorageSuccess,
  deleteRecipesFromLocalStorage,
  deleteRecipesFromLocalStorageFailure,
  deleteRecipesFromLocalStorageSuccess,
  fetchRecipesFromLocalStorage,
  fetchRecipesFromLocalStorageFailure,
  fetchRecipesFromLocalStorageSuccess,
  increaseRecipeCounter,
  increaseRecipeCounterFailure,
  increaseRecipeCounterSuccess,
} from './shopping-list.actions';
import { tap, map, catchError } from 'rxjs/operators';
import { of, switchMap } from 'rxjs';
import { Recipe } from 'src/app/models/recipe';
import { RecipesListService } from 'src/app/recipes-list/services/recipes-list.service';

@Injectable()
export class ShoppingListEffects {
  constructor(
    private actions$: Actions,
    private snackBar: MatSnackBar,
    private recipesListService: RecipesListService
  ) {}

  deleteRecipeLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRecipesFromLocalStorage),
      map((payload) => {
        const localRecipes: Recipe[] = JSON.parse(
          localStorage.getItem('shoppingList') ?? '[]'
        );
        const recipes = localRecipes.filter(
          (localRecipe) =>
            !payload.recipes.some(
              (payloadRecipe) => payloadRecipe.id === localRecipe.id
            )
        );
        localStorage.setItem('shoppingList', JSON.stringify(recipes));
        return deleteRecipesFromLocalStorageSuccess({
          recipes: recipes,
        });
      }),
      catchError((error: Error) =>
        of(deleteRecipesFromLocalStorageFailure({ error }))
      )
    )
  );

  deleteRecipeLocalStorageFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteRecipesFromLocalStorageFailure),
        tap((error) => {
          this.snackBar.open(error.error.message);
        })
      ),
    { dispatch: false }
  );

  fetchRecipeLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipesFromLocalStorage),
      map(() => {
        const recipes: Recipe[] = JSON.parse(
          localStorage.getItem('shoppingList') ?? '[]'
        );
        return fetchRecipesFromLocalStorageSuccess({ recipes });
      }),
      catchError((error: Error) =>
        of(fetchRecipesFromLocalStorageFailure({ error }))
      )
    )
  );

  fetchRecipeLocalStorageFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchRecipesFromLocalStorageFailure),
        tap((error) => {
          this.snackBar.open(error.error.message);
        })
      ),
    { dispatch: false }
  );

  addRecipeLocalStorage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRecipeToLocalStorage),
      map((payload) => {
        const recipes: Recipe[] = JSON.parse(
          localStorage.getItem('shoppingList') ?? '[]'
        );
        recipes.push(payload.recipe);
        localStorage.setItem('shoppingList', JSON.stringify(recipes));
        return addRecipeToLocalStorageSuccess({ recipes });
      }),
      catchError((error: Error) =>
        of(addRecipeToLocalStorageFailure({ error }))
      )
    )
  );

  addRecipeLocalStorageFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addRecipeToLocalStorageFailure),
        tap((error) => {
          this.snackBar.open(error.error.message);
        })
      ),
    { dispatch: false }
  );

  increaseRecipeCounter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(increaseRecipeCounter),
      switchMap((payload) =>
        this.recipesListService.update(payload.recipe).pipe(
          map((updatedRecipe) =>
            increaseRecipeCounterSuccess({ recipe: updatedRecipe })
          ),
          catchError((error) => of(increaseRecipeCounterFailure({ error })))
        )
      )
    )
  );

  increaseRecipeCounterFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(increaseRecipeCounterFailure),
        tap((error) => {
          this.snackBar.open(error.error.message);
        })
      ),
    { dispatch: false }
  );
}
