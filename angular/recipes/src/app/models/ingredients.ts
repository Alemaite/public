import { IngredientModel } from './ingredient';

export class IngredientsModel {
  constructor(
    public title: string,
    public ingredients: IngredientModel[],
    public _id?: string,
    public desc?: string
  ) {}
}
