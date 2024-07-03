import { Recipe } from './recipe';

export class ShoppingListModel {
  constructor(public userId: string, public items: Recipe[]) {}
}
