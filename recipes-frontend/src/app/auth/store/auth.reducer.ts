import { createReducer, on } from '@ngrx/store';
import { initialUserInfoState } from './auth.state';
import {
  addRecipeToFavorites,
  addRecipeToFavoritesFailure,
  addRecipeToFavoritesSuccess,
  fetchUser,
  fetchUserInfo,
  fetchUserInfoFailure,
  fetchUserInfoSuccess,
  fetchUserSuccess,
  logInWithGoogle,
  logInWithGoogleFailure,
  logInWithGoogleSuccess,
  logOutWithGoogle,
  updateFavorites,
  updateFavoritesFailure,
  updateFavoritesSuccess,
} from './auth.actions';

export const authReducer = createReducer(
  initialUserInfoState,
  on(updateFavoritesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(updateFavoritesSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(updateFavorites, (state) => ({
    ...state,
    loading: true,
  })),
  on(addRecipeToFavorites, (state) => ({
    ...state,
    loading: true,
  })),
  on(addRecipeToFavoritesSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(addRecipeToFavoritesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(fetchUser, (state) => ({ ...state, loading: true })),
  on(fetchUserSuccess, (state, { user }) => ({
    ...state,
    user,
    loading: false,
  })),
  on(fetchUserInfoFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(logInWithGoogle, (state) => ({
    ...state,
    loading: true,
  })),
  on(logInWithGoogleSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(logInWithGoogleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(logOutWithGoogle, (state) => ({
    ...state,
    loading: true,
  })),
  on(logInWithGoogleSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(logInWithGoogleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(fetchUserInfo, (state) => ({ ...state, loading: true })),
  on(fetchUserInfoSuccess, (state, { email, name, picture, loggedIn }) => ({
    ...state,
    info: {
      email,
      name,
      picture,
    },
    loggedIn,
    loading: false,
  })),
  on(fetchUserInfoFailure, (state, { error, loggedIn }) => ({
    ...state,
    error,
    loggedIn,
    loading: false,
  }))
);
