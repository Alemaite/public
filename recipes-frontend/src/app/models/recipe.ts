import { Ingredient } from './ingredient';

export class Recipe {
  title: string;
  id?: string;
  ingredients?: Ingredient[];
  desc: string[];
  shortDesc?: string;
  imagePath?: string;

  constructor(
    title: string = '',
    id?: string,
    ingredients: Ingredient[] = [],
    desc: string[] = [],
    shortDesc?: string,
    imagePath?: string
  ) {
    this.title = title;
    this.id = id;
    this.ingredients = ingredients;
    this.desc = desc;
    this.shortDesc = shortDesc;
    this.imagePath = imagePath;
  }
}
