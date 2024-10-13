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
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { GoogleOAuthService } from '../services/google-oauth.service';
import { from, of } from 'rxjs';
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

  fetchUserInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUserInfo),
      switchMap(() =>
        from(this.googleOAuthService.loadUserProfile()).pipe(
          switchMap((userInfo) =>
            of(
              fetchUserInfoSuccess({
                email: userInfo.info.email,
                name: userInfo.info.name,
                picture: userInfo.info.picture,
                loading: false,
                loggedIn: true,
              })
            )
          ),
          catchError(() =>
            of(
              fetchUserInfoFailure({
                message: 'Unable to load user profile. Please log in.',
                loading: false,
                loggedIn: false,
              })
            )
          )
        )
      )
    )
  );

  fetchUserInfoSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUserInfoSuccess),
      switchMap((userInfo) => {
        if (userInfo.name && userInfo.email) {
          return of(
            createUserIfDoesNotExist({
              fullName: userInfo.name,
              email: userInfo.email,
              loading: true,
            })
          );
        } else {
          return of(
            createUserIfDoesNotExistFailure({
              message: 'Name or Email not provided.',
              loading: false,
              loggedIn: false,
            })
          );
        }
      })
    )
  );

  fetchUserInfoFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchUserInfoFailure),
        tap((error) => {
          this.snackBar.open(error.message);
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
            switchMap((user) =>
              of(createUserIfDoesNotExistSuccess({ user, loading: true }))
            ),
            catchError(() =>
              of(
                createUserIfDoesNotExistFailure({
                  message:
                    'Error when adding user to database (if does not exist).',
                  loading: false,
                  loggedIn: false,
                })
              )
            )
          );
      })
    )
  );

  createUserIfDoesNotExistSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUserIfDoesNotExistSuccess),
      switchMap((user) => {
        if (user.user.email) {
          return of(fetchUser({ email: user.user.email, loading: true }));
        } else {
          return of(
            createUserIfDoesNotExistFailure({
              message: 'No email provided to fetch user from database.',
              loading: false,
              loggedIn: false,
            })
          );
        }
      })
    )
  );

  createUserIfDoesNotExistFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createUserIfDoesNotExistFailure),
        tap((error) => {
          this.snackBar.open(error.message);
        })
      ),
    { dispatch: false }
  );

  fetchUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(fetchUser),
      switchMap((payload) => {
        return this.userService.getUser(payload.email).pipe(
          switchMap((user) => of(fetchUserSuccess({ user, loading: false }))),
          catchError(() =>
            of(
              fetchUserFailure({
                message: 'Error fetching user from database.',
                loading: false,
                loggedIn: false,
              })
            )
          )
        );
      })
    )
  );

  fetchUserFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchUserFailure),
        tap((error) => {
          this.snackBar.open(error.message);
        })
      ),
    { dispatch: false }
  );

  updateFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateFavorites),
      switchMap((payload) => {
        return this.userService
          .updateFavorites(payload.email, payload.recipes)
          .pipe(
            switchMap((user) =>
              of(updateFavoritesSuccess({ user, loading: false }))
            ),
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
        tap((error) => {
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
            switchMap((user) =>
              of(addRecipeToFavoritesSuccess({ user, loading: false }))
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
        tap((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  logoutWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logOutWithGoogle),
      tap(() => this.googleOAuthService.logOut()),
      switchMap(() => of(logOutWithGoogleSuccess({ loading: false }))),
      catchError((error: HttpErrorResponse) =>
        of(logOutWithGoogleFailure({ error, loading: false }))
      )
    )
  );

  logoutWithGoogleFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logOutWithGoogleFailure),
        tap((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );

  loginWithGoogle$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logInWithGoogle),
      tap(() => this.googleOAuthService.login()),
      switchMap(() => of(logInWithGoogleSuccess({ loading: false }))),
      catchError((error: HttpErrorResponse) =>
        of(logInWithGoogleFailure({ error, loading: false }))
      )
    )
  );

  loginWithGoogleFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logInWithGoogleFailure),
        tap((error) => {
          this.snackBar.open(error.error.error.message);
        })
      ),
    { dispatch: false }
  );
}
