export enum Unit {
  GRAMS = 'g',
  KILLOGRAMS = 'kg',
  MILILITERS = 'ml',
  LITERS = 'l',
  PIECES = 'pcs',
  TEASPOONS = 'tsp',
  TABLESPOONS = 'tbsp',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  CAN = 'can',
  CUP = 'cup',
  CUPS = 'cups',
  BLOCK = 'block',
  PACKAGE = 'package',
}

export function units() {
  return Object.values(Unit);
}
