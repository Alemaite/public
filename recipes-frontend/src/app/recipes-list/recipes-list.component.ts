import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { fetchRecipesPage } from './store/recipes-list.actions';
import { selectRecipesListPage } from './store/recipes-list.selectors';
import { Recipe } from '../models/recipe';
import { gsap } from 'gsap';
import SplitTextJS from 'split-text-js';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RecipesListService } from './services/recipes-list.service';
import { debounceTime } from 'rxjs/operators';

@UntilDestroy()
@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  handset$ = this.responsive.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.HandsetLandscape,
    Breakpoints.TabletPortrait,
    Breakpoints.TabletLandscape,
  ]);
  recipes: Recipe[] = [];
  paginatorLength: number;
  pageSize = 6;
  pageIndex = 0;
  hidePageSize = false;
  showPageSizeOptions = true;
  showFirstLastButtons = true;
  disabled = false;
  pageEvent: PageEvent;
  filterValue = '';
  loading: boolean;
  isUnderTest = false;

  constructor(
    private responsive: BreakpointObserver,
    private store: Store,
    public recipeListService: RecipesListService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectRecipesListPage)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.recipes = state.content;
        this.paginatorLength = state.page.totalElements;
        this.loading = state.loading;
      });
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
  }

  ngAfterViewInit(): void {
    if (this.isUnderTest) {
      return;
    }
    const titles: never[] = gsap.utils.toArray('.animation-txt');
    const timeLine = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    titles.forEach((title) => {
      const splitTitle = new SplitTextJS(title);
      timeLine
        .from(
          splitTitle.chars,
          {
            opacity: 0,
            y: 80,
            rotateX: -90,
            stagger: 0.02,
          },
          '<'
        )
        .to(
          splitTitle.chars,
          {
            opacity: 0,
            y: -80,
            rotateX: 90,
            stagger: 0.02,
          },
          '<3'
        );
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
}
