import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { RecipeService } from "../services/recipe.service";
import { fetchRecipeById } from "./recipe.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { fetchRecipeByIdSuccess } from "./recipe.actions";
import { fetchRecipeByIdFailure } from "./recipe.actions";

@Injectable()
export class RecipeEffects {

  constructor(
    private actions$: Actions,
    private recipeService: RecipeService,
    private snackBar: MatSnackBar
  ) {}

  fetchRecipeById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipeById),
      switchMap((payload) => {
        return this.recipeService.read(payload.id).pipe(
          map((recipe) => fetchRecipeByIdSuccess({ recipe })),
          catchError((error: HttpErrorResponse) =>
            of(fetchRecipeByIdFailure({ error }))
          )
        );
      })
    )
  );

  fetchRecipeByIdFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchRecipeByIdFailure),
      map((error) => {
        this.snackBar.open(error.error.message);
        return error;
      })
    ),
    { dispatch: false }
  );

}
