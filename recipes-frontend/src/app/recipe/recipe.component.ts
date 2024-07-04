import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Recipe } from '../models/recipe';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { addRecipeTrigger, fetchRecipeById } from './store/recipe.actions';
import { selectRecipe } from './store/recipe.selector';
import {
  addRecipeToLocalStorage,
  fetchRecipesFromLocalStorage,
} from '../shopping-list/store/shopping-list.actions';
import { selectShoppingList } from '../shopping-list/store/shopping-list.selector';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-recipes',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.css'],
})
export class RecipeComponent implements OnInit {
  handsetMode = false;
  recipe: Recipe;
  recipesInLocalStorage: Recipe[];

  constructor(
    private route: ActivatedRoute,
    private store: Store,
    private responsive: BreakpointObserver,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.responsive
      .observe([
        Breakpoints.HandsetPortrait,
        Breakpoints.HandsetLandscape,
        Breakpoints.TabletPortrait,
        Breakpoints.TabletLandscape,
        Breakpoints.Medium,
      ])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
        return;
      });
    this.route.params
      .pipe(untilDestroyed(this))
      .subscribe((params: { id?: string }) => {
        if (params.id) {
          this.store.dispatch(fetchRecipeById({ id: params.id }));
        }
      });
    this.store
      .select(selectRecipe)
      .pipe(untilDestroyed(this))
      .subscribe((payload) => {
        if (payload.recipe) {
          this.recipe = payload.recipe;
        }
      });
    this.store.dispatch(fetchRecipesFromLocalStorage());
    this.store
      .select(selectShoppingList)
      .pipe(untilDestroyed(this))
      .subscribe((payload) => {
        this.recipesInLocalStorage = payload.recipes;
      });
  }

  onAddItems() {
    if (this.duplicateCheck()) {
      this.snackbar.open('This recipe is already on your shopping list');
      return;
    }
    this.store.dispatch(addRecipeTrigger({ trigger: true }));
    this.store.dispatch(addRecipeToLocalStorage({ recipe: this.recipe }));
  }

  duplicateCheck(): boolean {
    const duplicate = this.recipesInLocalStorage.find(
      (recipe: Recipe) => recipe.id === this.recipe.id
    );
    if (duplicate) {
      return true;
    }
    return false;
  }
}
