import { LocalStorageEnum } from 'src/app/enums/local-storage.enum';
import { Page } from 'src/app/models/page';
import { Recipe } from 'src/app/models/recipe';

export interface RecipesListState {
  recipes: Recipe[];
  loading: boolean;
}

export interface RecipesListPageState {
  content: Recipe[];
  page: Page;
  search: string;
  loading: boolean;
}

export const initialRecipesListState: RecipesListState = {
  recipes: [],
  loading: false,
};

export const initialRecipesListPageState: RecipesListPageState = {
  content: [],
  page: {
    number: Number(localStorage.getItem(LocalStorageEnum.RECIPESLISTPAGE)) ?? 0,
    size: 6,
    totalElements: 0,
    totalPages: 0,
  },
  search: '',
  loading: false,
};
