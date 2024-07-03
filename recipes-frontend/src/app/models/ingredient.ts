import { Unit } from '../enums/unit.enums';

export class Ingredient {
  quantity: number;
  unit: string;
  name: string;

  constructor(
    name: string = '',
    quantity: number = 0,
    unit: string = Unit.GRAMS
  ) {
    this.quantity = quantity;
    this.unit = unit;
    this.name = name;
  }
}
