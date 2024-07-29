import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Store } from '@ngrx/store';
import { selectShoppingList } from './store/shopping-list.selector';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

import { deleteRecipesFromLocalStorage } from './store/shopping-list.actions';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@UntilDestroy()
@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
  providers: [],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ShoppingListComponent implements OnInit {
  displayedColumns = ['select', 'title', 'expand', 'copy'];
  dataSource: Recipe[];
  selection = new SelectionModel<Recipe>(true, []);
  expandedRecipes: Recipe[] = [];
  columnsToDisplayWithExpand = [...this.displayedColumns];
  handsetPortrait$ = this.responsive.observe([Breakpoints.HandsetPortrait]);

  constructor(private store: Store, private responsive: BreakpointObserver) {}

  ngOnInit(): void {
    this.store
      .select(selectShoppingList)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.dataSource = state.recipes;
        this.expandedRecipes = [...this.dataSource];
      });
  }

  onExport() {
    const textToWrite = this.onCopySelected();
    const blob = new Blob([textToWrite], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'recipes.txt';
    link.click();
    window.URL.revokeObjectURL(url);
  }

  onCopySelected() {
    const selectedStringArray: string[] = [];
    this.selection.selected.forEach((recipe) =>
      selectedStringArray.push(this.onCopy(recipe))
    );
    return selectedStringArray.join('\n\n');
  }

  onCopy(recipe: Recipe) {
    const recipeTitle = recipe.title;
    let ingredientsString = '';
    if (recipe.ingredients) {
      ingredientsString = recipe.ingredients
        .map(
          (ingredient) =>
            `${ingredient.quantity} ${ingredient.unit} of ${ingredient.name}`
        )
        .join('\n');
    }
    return recipeTitle + '\n' + ingredientsString;
  }

  onExpand(recipe: Recipe) {
    if (!this.isIncluded(recipe)) {
      this.expandedRecipes.push(recipe);
      return;
    }
    const indexToRemove = this.expandedRecipes.findIndex(
      (expandedRecipe) => expandedRecipe === recipe
    );
    this.expandedRecipes.splice(indexToRemove, 1);
  }

  isIncluded(payload: Recipe): boolean {
    return this.expandedRecipes.includes(payload);
  }

  onDelete() {
    this.store.dispatch(
      deleteRecipesFromLocalStorage({ recipes: this.selection.selected })
    );
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource);
  }

  checkboxLabel(row?: Recipe): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.title + 1
    }`;
  }
}
