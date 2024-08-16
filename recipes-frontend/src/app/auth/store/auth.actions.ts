import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from 'src/app/models/user';
import { Recipe } from 'src/app/models/recipe';

const componentName = '[Auth]';

export const updateFavorites = createAction(
  `${componentName} Update Favorites`,
  props<{ email: string; recipes: Recipe[]; loading: boolean }>()
);

export const updateFavoritesSuccess = createAction(
  `${componentName} Update Favorites Success`,
  props<{ user: User; loading: boolean }>()
);

export const updateFavoritesFailure = createAction(
  `${componentName} Update Favorites Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const addRecipeToFavorites = createAction(
  `${componentName} Add Recipe to User Favorites`,
  props<{ email: string; recipe: Recipe; loading: boolean }>()
);

export const addRecipeToFavoritesSuccess = createAction(
  `${componentName} Add Recipe to User Favorites Success`,
  props<{ user: User; loading: boolean }>()
);

export const addRecipeToFavoritesFailure = createAction(
  `${componentName} Add Recipe to User Favorites Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const createUserIfDoesNotExist = createAction(
  `${componentName} Create User If Does Not Exist`,
  props<{ fullName: string; email: string; loading: boolean }>()
);

export const createUserIfDoesNotExistSuccess = createAction(
  `${componentName} Create User If Does Not Exist Success`,
  props<{ user: User; loading: boolean }>()
);

export const createUserIfDoesNotExistFailure = createAction(
  `${componentName} Create User If Does Not Exist Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const fetchUser = createAction(
  `${componentName} Fetch User`,
  props<{ email: string; loading: boolean }>()
);

export const fetchUserSuccess = createAction(
  `${componentName} Fetch User Success`,
  props<{ user: User; loading: boolean }>()
);

export const fetchUserFailure = createAction(
  `${componentName} Fetch User Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const logInWithGoogle = createAction(
  `${componentName} Login With Google`,
  props<{ loading: boolean }>()
);

export const logInWithGoogleSuccess = createAction(
  `${componentName} Login With Google Success`,
  props<{ loading: boolean }>()
);

export const logInWithGoogleFailure = createAction(
  `${componentName} Login With Google Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const logOutWithGoogle = createAction(
  `${componentName} Logout With Google`,
  props<{ loading: boolean }>()
);

export const logOutWithGoogleSuccess = createAction(
  `${componentName} Logout With Google Success`,
  props<{ loading: boolean }>()
);

export const logOutWithGoogleFailure = createAction(
  `${componentName} Logout With Google Failure`,
  props<{ error: HttpErrorResponse; loading: boolean }>()
);

export const fetchUserInfo = createAction(
  `${componentName} Fetch User Info`,
  props<{ loading: boolean }>()
);

export const fetchUserInfoSuccess = createAction(
  `${componentName} Fetch User Info Success`,
  props<{
    email: string;
    name: string;
    picture: string;
    loading: boolean;
    loggedIn: boolean;
  }>()
);

export const fetchUserInfoFailure = createAction(
  `${componentName} Fetch User Info Failure`,
  props<{ error: HttpErrorResponse; loading: boolean; loggedIn: boolean }>()
);
