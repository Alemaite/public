import { AfterViewInit, Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { fetchRecipesPage } from './store/recipes-list.actions';
import { selectRecipesListPage } from './store/recipes-list.selectors';
import { gsap } from 'gsap';
import SplitTextJS from 'split-text-js';
import { PageEvent } from '@angular/material/paginator';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { RecipesListService } from './services/recipes-list.service';
import { debounceTime } from 'rxjs/operators';
import { LocalStorageEnum } from '../enums/local-storage.enum';

@UntilDestroy()
@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit, AfterViewInit {
  handset$ = this.responsive.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.HandsetLandscape,
    Breakpoints.TabletPortrait,
    Breakpoints.TabletLandscape,
  ]);
  recipesPage$ = this.store.select(selectRecipesListPage);
  savedPage =
    Number(localStorage.getItem(LocalStorageEnum.RECIPESLISTPAGE)) ?? 0;
  filterValue = '';
  // used for unit testing only
  isUnderTest = false;

  constructor(
    private responsive: BreakpointObserver,
    private store: Store,
    public recipeListService: RecipesListService
  ) {}

  ngOnInit(): void {
    this.recipeListService.filter$
      .pipe(debounceTime(300), untilDestroyed(this))
      .subscribe((searchTerm) =>
        this.store.dispatch(
          fetchRecipesPage({
            page: this.savedPage,
            size: 6,
            search: searchTerm,
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
    const timeLine = gsap.timeline({ repeat: 10, repeatDelay: 1 });
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
    localStorage.setItem(
      LocalStorageEnum.RECIPESLISTPAGE,
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
}
