import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addRecipeToFavorites,
  addRecipeToFavoritesFailure,
  addRecipeToFavoritesSuccess,
  createUserIfDoesNotExist,
  createUserIfDoesNotExistFailure,
  createUserIfDoesNotExistSuccess,
  fetchUser,
  fetchUserFailure,
  fetchUserInfo,
  fetchUserInfoFailure,
  fetchUserInfoSuccess,
  fetchUserSuccess,
  logInWithGoogle,
  logInWithGoogleFailure,
  logInWithGoogleSuccess,
  logOutWithGoogle,
  logOutWithGoogleFailure,
  logOutWithGoogleSuccess,
  updateFavorites,
  updateFavoritesFailure,
  updateFavoritesSuccess,
} from './auth.actions';
import { catchError, map, switchMap, last } from 'rxjs/operators';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../services/user-service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private googleOAuthService: GoogleOAuthService,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  updateFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFavorites),
      switchMap((payload) => {
        return this.userService
          .updateFavorites(payload.email, payload.recipes)
          .pipe(
            map((user) => updateFavoritesSuccess({ user, loading: false })),
            catchError((error: HttpErrorResponse) =>
              of(updateFavoritesFailure({ error, loading: false }))
            )
          );
      })
    )
  );

  updateFavoritesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateFavoritesFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  addRecipeToFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addRecipeToFavorites),
      switchMap((payload) => {
        return this.userService
          .addRecipeToFavorites(payload.email, payload.recipe)
          .pipe(
            map((user) =>
              addRecipeToFavoritesSuccess({ user, loading: false })
            ),
            catchError((error: HttpErrorResponse) =>
              of(addRecipeToFavoritesFailure({ error, loading: false }))
            )
          );
      })
    )
  );

  addRecipeToFavoritesFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addRecipeToFavoritesFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  createUserIfDoesNotExist$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUserIfDoesNotExist),
      switchMap((payload) => {
        return this.userService
          .addUserIfDoesNotExist(payload.fullName, payload.email)
          .pipe(
            map((user) =>
              createUserIfDoesNotExistSuccess({ user, loading: false })
            ),
            catchError((error: HttpErrorResponse) =>
              of(createUserIfDoesNotExistFailure({ error, loading: false }))
            )
          );
      })
    )
  );

  createUserIfDoesNotExistFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createUserIfDoesNotExistFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  fetchUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUser),
      switchMap((payload) => {
        return this.userService.getUser(payload.email).pipe(
          map((user) => fetchUserSuccess({ user, loading: false })),
          catchError((error: HttpErrorResponse) =>
            of(fetchUserFailure({ error, loading: false }))
          )
        );
      })
    )
  );

  fetchUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchUserFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  logoutWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logOutWithGoogle),
      map(() => {
        this.googleOAuthService.logOut();
        return logOutWithGoogleSuccess({ loading: false });
      }),
      catchError((error: HttpErrorResponse) =>
        of(logOutWithGoogleFailure({ error, loading: false }))
      )
    )
  );

  logoutWithGoogleFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logOutWithGoogleFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logInWithGoogle),
      map(() => {
        this.googleOAuthService.login();
        return logInWithGoogleSuccess({ loading: false });
      }),
      catchError((error: HttpErrorResponse) =>
        of(logInWithGoogleFailure({ error, loading: false }))
      )
    )
  );

  loginWithGoogleFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logInWithGoogleFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  fetchUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUserInfo),
      switchMap(() => {
        return this.googleOAuthService.loadUserProfile().pipe(
          last(),
          map((userInfo) => {
            return fetchUserInfoSuccess({
              email: userInfo?.info.email ?? '',
              name: userInfo?.info.name ?? '',
              picture: userInfo?.info.picture ?? '',
              loading: false,
              loggedIn: this.googleOAuthService.validAccessToken(),
            });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              fetchUserInfoFailure({
                error,
                loading: false,
                loggedIn: this.googleOAuthService.validAccessToken(),
              })
            )
          )
        );
      })
    )
  );

  fetchUserInfoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUserInfoSuccess),
      map((userInfo) => {
        return fetchUser({ email: userInfo.email, loading: false });
      })
    )
  );

  fetchUserInfoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchUserInfoFailure),
        map((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );
}
