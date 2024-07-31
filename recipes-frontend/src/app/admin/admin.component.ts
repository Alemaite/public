import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Store } from '@ngrx/store';
import { selectRecipesListPage } from '../recipes-list/store/recipes-list.selectors';
import {
  createRecipeFrontendOnlySuccess,
  fetchRecipesPage,
  updateRecipeFrontendOnlySuccess,
} from '../recipes-list/store/recipes-list.actions';
import { SelectionModel } from '@angular/cdk/collections';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RecipesListService } from '../recipes-list/services/recipes-list.service';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { LocalStorageEnum } from '../enums/local-storage.enum';

@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatDialogModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    RouterModule,
    CommonModule,
  ],
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
export class AdminComponent implements OnInit {
  displayedColumns = ['select', 'title', 'expand', 'buttons'];
  recipesPage$ = this.store.select(selectRecipesListPage);
  savedPage = Number(localStorage.getItem(LocalStorageEnum.ADMINLISTPAGE)) ?? 0;
  recipes: Recipe[];
  selection = new SelectionModel<Recipe>(true, []);
  expandedRecipe: Recipe | null;
  paginatorLength: number;
  filterValue = '';
  handsetPortrait$ = this.responsive.observe([Breakpoints.HandsetPortrait]);
  handsetLandscape$ = this.responsive.observe([Breakpoints.HandsetLandscape]);
  columnsToDisplayWithExpand = [...this.displayedColumns];

  constructor(
    private store: Store,
    public dialog: MatDialog,
    private actions$: Actions,
    public recipeListService: RecipesListService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.recipeListService.filter$
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((searchTerm) => {
        this.recipes = [];
        this.store.dispatch(
          fetchRecipesPage({
            page: this.savedPage,
            size: 6,
            search: searchTerm,
            loading: true,
          })
        );
      });
    this.recipesPage$.pipe(untilDestroyed(this)).subscribe((state) => {
      this.recipes = state.content;
      this.paginatorLength = state.page.totalElements;
    });
    // just for demo purposes, in a real app changes would be done in the database
    this.actions$
      .pipe(untilDestroyed(this), ofType(updateRecipeFrontendOnlySuccess))
      .subscribe((payload) => this.updateRecipesFrontendOnly(payload.recipe));
    this.actions$
      .pipe(untilDestroyed(this), ofType(createRecipeFrontendOnlySuccess))
      .subscribe((payload) => {
        const dataSourceCopy = [...this.recipes];
        dataSourceCopy.push(payload.recipe);
        this.recipes = dataSourceCopy;
        this.paginatorLength++;
      });
  }

  applyFilter($event: Event) {
    this.filterValue = ($event.target as HTMLInputElement).value;
    this.recipeListService.filterUtil(this.filterValue);
  }

  handlePageEvent(e: PageEvent) {
    localStorage.setItem(
      LocalStorageEnum.ADMINLISTPAGE,
      e.pageIndex.toString()
    );
    this.savedPage = e.pageIndex;
    this.store.dispatch(
      fetchRecipesPage({
        page: e.pageIndex,
        size: e.pageSize,
        search: this.filterValue,
        loading: true,
      })
    );
  }

  private updateRecipesFrontendOnly(recipe: Recipe) {
    const indexToUpdate = this.recipes.findIndex((r) => r.id === recipe.id);
    if (indexToUpdate !== -1) {
      const dataSourceCopy = [...this.recipes];
      dataSourceCopy[indexToUpdate] = recipe;
      this.recipes = dataSourceCopy;
    }
  }

  openDialog(recipe?: Recipe): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: recipe ? { recipe, editMode: true } : { recipe: new Recipe() },
    });
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteRecipes() {
    // uncomment below to delete from the backend
    // const ids: string[] = [];
    // this.selection.selected.map((recipe) => {
    //   if (recipe.id) {
    //     ids.push(recipe.id);
    //   }
    // });
    // this.store.dispatch(deleteRecipes({ ids }));

    // delete from frontend only for demo purposes below
    this.selection.selected.map((recipe) => {
      this.recipes = this.recipes.filter((r) => r.id !== recipe.id);
    });
    this.paginatorLength -= this.selection.selected.length;
    this.selection.clear();
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.recipes.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.recipes);
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
