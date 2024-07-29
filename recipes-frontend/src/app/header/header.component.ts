import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import {
  animate,
  style,
  transition,
  trigger,
  keyframes,
} from '@angular/animations';
import { Store } from '@ngrx/store';
import { selectShoppingList } from '../shopping-list/store/shopping-list.selector';
import { selectTrigger } from '../recipe/store/recipe.selector';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { fetchRecipesFromLocalStorage } from '../shopping-list/store/shopping-list.actions';

@UntilDestroy()
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('shake', [
      transition('false => true', [
        animate(
          '1s ease-in-out',
          keyframes([
            style({ transform: 'rotate(0)' }),
            style({ transform: 'rotate(-10deg)' }),
            style({ transform: 'rotate(10deg)' }),
            style({ transform: 'rotate(-10deg)' }),
            style({ transform: 'rotate(10deg)' }),
            style({ transform: 'rotate(0)' }),
          ])
        ),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit {
  handsetPortrait$ = this.responsive.observe([Breakpoints.HandsetPortrait]);
  recipesAdded: number;
  triggerAnimation = false;

  constructor(private store: Store, private responsive: BreakpointObserver) {}

  ngOnInit(): void {
    this.store.dispatch(fetchRecipesFromLocalStorage());
    this.store
      .select(selectShoppingList)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.recipesAdded = state.recipes.length;
      });
    this.store
      .select(selectTrigger)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.triggerAnimation = state.trigger;
        setTimeout(() => (this.triggerAnimation = false), 1000);
      });
  }
}
