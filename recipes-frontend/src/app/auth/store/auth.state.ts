import { User } from 'src/app/models/user';

export interface UserInfoState {
  info: {
    email: string | null;
    name: string | null;
    picture: string | null;
  };
  loading: boolean;
  loggedIn?: boolean;
}

export interface GoogleLoginLogoutState {
  loading: boolean;
}

export interface UserState {
  user: User;
  loading: boolean;
}

export const initialUserInfoState: UserInfoState = {
  info: {
    email: null,
    name: null,
    picture: null,
  },
  loading: false,
};

export const initialGoogleLoginState: GoogleLoginLogoutState = {
  loading: false,
};

export const initialUserState: UserState = {
  user: new User(),
  loading: false,
};
