import { Component, OnInit } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Store } from '@ngrx/store';
import { selectRecipesListPage } from '../recipes-list/store/recipes-list.selectors';
import {
  createRecipeFrontendOnlySuccess,
  deleteRecipes,
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
import { EditDialogComponent } from './dialog/dialog.component';
import { Actions, ofType } from '@ngrx/effects';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fetchRecipesFromLocalStorage } from '../shopping-list/store/shopping-list.actions';
import { RecipesListService } from '../recipes-list/services/recipes-list.service';
import { PageEvent } from '@angular/material/paginator';
import { debounceTime } from 'rxjs/operators';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@UntilDestroy()
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
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
  dataSource: Recipe[];
  selection = new SelectionModel<Recipe>(true, []);
  expandedRecipe: Recipe | null;
  pageSize = 6;
  pageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  paginatorLength: number;
  filterValue = '';
  pageEvent: PageEvent;
  handsetMode: boolean;
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
      .subscribe((search) =>
        this.store.dispatch(
          fetchRecipesPage({
            page: this.pageIndex,
            size: this.pageSize,
            search: search,
            loading: true,
          })
        )
      );
    // fetching recipes from local storage to update the shopping list header icon, if directly visiting admin area
    this.store.dispatch(fetchRecipesFromLocalStorage());
    this.store
      .select(selectRecipesListPage)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.dataSource = state.content;
        this.paginatorLength = state.page.totalElements;
        this.pageIndex = state.page.number;
        this.pageSize = state.page.size;
      });
    // just for demo purposes, in a real app changes would be done in the database
    this.actions$
      .pipe(untilDestroyed(this), ofType(updateRecipeFrontendOnlySuccess))
      .subscribe((payload) => this.updateRecipesFrontendOnly(payload.recipe));

    this.actions$
      .pipe(untilDestroyed(this), ofType(createRecipeFrontendOnlySuccess))
      .subscribe((payload) => {
        const dataSourceCopy = [...this.dataSource];
        dataSourceCopy.push(payload.recipe);
        this.dataSource = dataSourceCopy;
        this.paginatorLength++;
      });

    this.responsive
      .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
      });
  }

  applyFilter($event: Event) {
    this.filterValue = ($event.target as HTMLInputElement).value;
    this.recipeListService.filterUtil(this.filterValue);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.paginatorLength = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.store.dispatch(
      fetchRecipesPage({
        page: this.pageIndex,
        size: this.pageSize,
        search: this.filterValue,
        loading: true,
      })
    );
  }

  updateRecipesFrontendOnly(recipe: Recipe) {
    const indexToUpdate = this.dataSource.findIndex((r) => r.id === recipe.id);
    if (indexToUpdate !== -1) {
      const dataSourceCopy = [...this.dataSource];
      dataSourceCopy[indexToUpdate] = recipe;
      this.dataSource = dataSourceCopy;
    }
  }

  openDialog(recipe?: Recipe): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: recipe ? { recipe, editMode: true } : { recipe: new Recipe() },
    });
    // dialogRef.afterClosed().subscribe((result) => {});
  }

  deleteRecipes() {
    // const ids: string[] = [];
    // this.selection.selected.map((recipe) => {
    //   if (recipe.id) {
    //     ids.push(recipe.id);
    //   }
    // });
    // this.store.dispatch(deleteRecipes({ ids }));

    // frontend only for demo purposes below
    this.selection.selected.map((recipe) => {
      this.dataSource = this.dataSource.filter((r) => r.id !== recipe.id);
    });
    this.paginatorLength -= this.selection.selected.length;
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
