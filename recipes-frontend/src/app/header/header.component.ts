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
  handsetMode = false;
  recipesAdded: number;
  triggerAnimation = false;

  constructor(private store: Store, private responsive: BreakpointObserver) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
        return;
      });
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
