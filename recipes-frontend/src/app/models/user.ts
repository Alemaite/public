import { Recipe } from './recipe';

export class User {
  id?: string;
  new?: boolean;
  fullName: string;
  email: string;
  favorites: Recipe[];

  constructor(
    name: string = '',
    email: string = '',
    favorites: Recipe[] = [],
    id?: string
  ) {
    this.id = id;
    this.fullName = name;
    this.email = email;
    this.favorites = favorites;
  }
}
