import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IngredientsModel } from '../models/ingredients';
import { Subject } from 'rxjs';
import { ObjectId } from 'mongoose';

@Injectable({ providedIn: 'root' })
export class AdminService {
  recipes = new Subject();
  recipe = new Subject();

  constructor(private http: HttpClient) {}

  postRecipe(recipe: IngredientsModel) {
    this.http.post('https://iu-recipes.click/api/recipes/', recipe).subscribe();
  }

  getAllRecipes() {
    this.http
      .get('https://iu-recipes.click/api/recipes/')
      .subscribe((recipes) => {
        this.recipes.next(recipes);
      });
  }

  getRecipe(id: ObjectId) {
    this.http
      .get('https://iu-recipes.click/api/' + id + '/recipe/')
      .subscribe((recipe) => {
        this.recipe.next(recipe);
      });
  }

  deleteRecipe(id: ObjectId) {
    this.http
      .post('https://iu-recipes.click/api/' + id + '/delete/', id)
      .subscribe(() => {
        this.getAllRecipes();
      });
  }
}
