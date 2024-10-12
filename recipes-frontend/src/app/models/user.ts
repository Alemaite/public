import { Recipe } from './recipe';

export class User {
  id?: string;
  new?: boolean;
  fullName: string | null;
  email: string | null;
  favorites: Recipe[];

  constructor(
    name: string | null = null,
    email: string | null = null,
    favorites: Recipe[] = [],
    id?: string
  ) {
    this.id = id;
    this.fullName = name;
    this.email = email;
    this.favorites = favorites;
  }
}
