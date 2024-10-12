import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserInfoState, UserState } from './auth.state';
import { ReducersEnum } from 'src/app/enums/reducers.enum';

const getUserInfoState = createFeatureSelector<UserInfoState>(
  ReducersEnum.AUTHREDUCER
);

const getUserState = createFeatureSelector<UserState>(ReducersEnum.AUTHREDUCER);

export const selectUserInfo = createSelector(
  getUserInfoState,
  (state) => state
);

export const selectUser = createSelector(getUserState, (state) => state);
