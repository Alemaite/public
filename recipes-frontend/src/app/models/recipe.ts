import { Ingredient } from './ingredient';
import { Data } from './data';

export class Recipe {
  title: string;
  id?: string;
  ingredients?: Ingredient[];
  desc: string[];
  shortDesc?: string;
  imagePath?: string;
  data: Data;

  constructor(
    title: string = '',
    id?: string,
    ingredients: Ingredient[] = [],
    desc: string[] = [],
    shortDesc?: string,
    imagePath?: string,
    data: Data = new Data()
  ) {
    this.title = title;
    this.id = id;
    this.ingredients = ingredients;
    this.desc = desc;
    this.shortDesc = shortDesc;
    this.imagePath = imagePath;
    this.data = data;
  }
}
