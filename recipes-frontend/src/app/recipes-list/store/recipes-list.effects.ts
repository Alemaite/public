import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, switchMap, catchError, of, map } from 'rxjs';
import {
  createRecipe,
  createRecipeFailure,
  createRecipeFrontendOnly,
  createRecipeFrontendOnlyFailure,
  createRecipeFrontendOnlySuccess,
  createRecipeSuccess,
  deleteRecipes,
  deleteRecipesFailure,
  deleteRecipesSuccess,
  fetchRecipes,
  fetchRecipesFailure,
  fetchRecipesPage,
  fetchRecipesPageFailure,
  fetchRecipesPageSuccess,
  fetchRecipesSuccess,
  updateRecipe,
  updateRecipeFailure,
  updateRecipeFrontendOnly,
  updateRecipeFrontendOnlyFailure,
  updateRecipeFrontendOnlySuccess,
  updateRecipeSuccess,
} from './recipes-list.actions';
import { Injectable } from '@angular/core';
import { RecipesListService } from '../services/recipes-list.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class RecipesListEffects {
  constructor(
    private actions$: Actions,
    private recipesListService: RecipesListService,
    private snackBar: MatSnackBar
  ) {}

  createRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRecipe),
      switchMap((payload) => {
        return this.recipesListService.create(payload.recipe).pipe(
          map((recipe) => createRecipeSuccess({ recipe })),
          catchError((error: HttpErrorResponse) =>
            of(createRecipeFailure({ error }))
          )
        );
      })
    )
  );

  createRecipeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createRecipeFailure),
        tap((error) => {
          this.snackBar.open(error.error.message);
        })
      ),
    { dispatch: false }
  );

  createRecipeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRecipeSuccess),
      tap(() => this.snackBar.open('Recipe created successfully')),
      map(() =>
        fetchRecipesPage({ page: 0, size: 6, search: '', loading: true })
      )
    )
  );

  createRecipeFrontendOnly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createRecipeFrontendOnly),
      switchMap((recipe) => {
        return of(createRecipeFrontendOnlySuccess(recipe)).pipe(
          catchError((error) => of(createRecipeFrontendOnlyFailure({ error })))
        );
      })
    )
  );

  createRecipeFrontendOnlySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createRecipeFrontendOnlySuccess),
        tap(() => this.snackBar.open('Recipe Created (Frontend Only)'))
      ),
    { dispatch: false }
  );

  createRecipeFrontendOnlyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createRecipeFrontendOnlyFailure),
        tap((payload) => this.snackBar.open(payload.error))
      ),
    { dispatch: false }
  );

  fetchRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipes),
      switchMap(() => {
        return this.recipesListService.readAll().pipe(
          map((recipes) => fetchRecipesSuccess({ recipes })),
          catchError((error: HttpErrorResponse) =>
            of(fetchRecipesFailure({ error }))
          )
        );
      })
    )
  );

  fetchRecipesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchRecipesFailure),
        tap((error) => this.snackBar.open(error.error.message))
      ),
    { dispatch: false }
  );

  fetchRecipesPage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipesPage),
      switchMap((payload) => {
        return this.recipesListService
          .read(payload.page, payload.size, payload.search)
          .pipe(
            map((payload) =>
              fetchRecipesPageSuccess({
                content: payload.content,
                page: payload.page,
                loading: false,
              })
            ),
            catchError((error: HttpErrorResponse) =>
              of(fetchRecipesPageFailure({ error, loading: payload.loading }))
            )
          );
      })
    )
  );

  fetchRecipesPageFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchRecipesPageFailure),
        tap((error) => this.snackBar.open(error.error.message))
      ),
    { dispatch: false }
  );

  updateRecipe$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRecipe),
      switchMap((payload) => {
        return this.recipesListService.update(payload.recipe).pipe(
          map((recipe) => updateRecipeSuccess({ recipe })),
          catchError((error: HttpErrorResponse) =>
            of(updateRecipeFailure({ error }))
          )
        );
      })
    )
  );

  updateRecipeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRecipeSuccess),
      map(() => fetchRecipes({ loading: true }))
    )
  );

  updateRecipeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateRecipeFailure),
        tap((error) => this.snackBar.open(error.error.message))
      ),
    { dispatch: false }
  );

  updateRecipeFrontendOnly$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRecipeFrontendOnly),
      switchMap((recipe) => {
        return of(updateRecipeFrontendOnlySuccess(recipe)).pipe(
          catchError((error) => of(updateRecipeFrontendOnlyFailure({ error })))
        );
      })
    )
  );

  updateRecipeFrontendOnlySuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateRecipeFrontendOnlySuccess),
        tap(() => this.snackBar.open('Recipe Updated (Frontend Only)'))
      ),
    { dispatch: false }
  );

  updateRecipeFrontendOnlyFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateRecipeFrontendOnlyFailure),
        tap((payload) => this.snackBar.open(payload.error))
      ),
    { dispatch: false }
  );

  deleteRecipes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRecipes),
      switchMap((payload) => {
        return this.recipesListService.delete(payload.ids).pipe(
          map(() => deleteRecipesSuccess({ ids: payload.ids })),
          catchError((error: HttpErrorResponse) =>
            of(deleteRecipesFailure({ error }))
          )
        );
      })
    )
  );

  deleteRecipesSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteRecipesSuccess),
      tap(() => this.snackBar.open('Recipe deleted successfully')),
      map(() =>
        fetchRecipesPage({ page: 0, size: 6, search: '', loading: true })
      )
    )
  );

  deleteRecipeFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(deleteRecipesFailure),
        tap((error) => this.snackBar.open(error.error.message))
      ),
    { dispatch: false }
  );
}
