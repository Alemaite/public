export enum RecipeImages {
  BURGER = 'Burger.jpg',
  BURRITO = 'Burrito.jpg',
  BOWL = 'Bowl.jpg',
  HUMMUS = 'Hummus.jpg',
  MEATBALLS = 'Meatballs.jpg',
  RAMEN = 'Ramen.jpg',
  CHICKPEA_PAN = 'chickpea-pan.jpg',
  BROCCOLI_SOUP = 'broccoli-soup.jpg',
  GNOCCHI = 'gnocchi.jpg',
  STUFFED_PEPPERS = 'stuffed-peppers.jpg',
  POTATO_GRATIN = 'potato-gratin.jpg',
  LASAGNA = 'lasagna.jpg',
}

export function recipeImages() {
  return Object.values(RecipeImages);
}
