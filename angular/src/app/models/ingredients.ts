import { IngredientModel } from './ingredient';

export class IngredientsModel {
  constructor(
    public title: string,
    public ingredients: IngredientModel[],
    public desc?: string
  ) {}
}
