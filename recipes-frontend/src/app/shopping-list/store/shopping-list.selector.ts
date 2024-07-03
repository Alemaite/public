import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ShoppingListState } from "./shopping-list.state";
import { ReducersEnum } from "src/app/enums/reducers.enum";



export const getShoppingListState = createFeatureSelector<ShoppingListState>(ReducersEnum.SHOPPING_LIST);

export const selectShoppingList = createSelector(getShoppingListState, (state) => state);
