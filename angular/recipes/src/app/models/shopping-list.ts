import { IngredientsModel } from './ingredients';

export class ShoppingListModel {
  constructor(public userId: string, public items: IngredientsModel[]) {}
}
