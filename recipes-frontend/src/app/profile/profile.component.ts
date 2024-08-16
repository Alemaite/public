import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Store } from '@ngrx/store';
import { selectRecipesList } from '../recipes-list/store/recipes-list.selectors';
import { fetchRecipes } from '../recipes-list/store/recipes-list.actions';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { UserInfo } from '../models/user-info';
import { Recipe } from '../models/recipe';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatAccordion, MatExpansionModule } from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  fetchUserInfo,
  logInWithGoogle,
  logOutWithGoogle,
  updateFavorites,
} from '../auth/store/auth.actions';
import { selectUser, selectUserInfo } from '../auth/store/auth.selector';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@UntilDestroy()
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    MatTooltipModule,
    CdkDropListGroup,
    CdkDropList,
    CdkDrag,
  ],
  animations: [
    trigger('imgsState', [
      state('beginning', style({ transform: 'translateX(0%)' })),
      state('end', style({ transform: 'translateX(-880%)' })),
      transition('beginning => end', [animate(100000)]),
    ]),
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  responsive$ = this.responsive.observe([Breakpoints.HandsetPortrait]);
  user$ = this.store.select(selectUserInfo);
  userFromDb$ = this.store.select(selectUser);
  recipesSelector$ = this.store.select(selectRecipesList);
  user: UserInfo;
  favoriteRecipes: Recipe[] = [];
  panelOpenState = false;
  imgsState = 'beginning';

  constructor(private store: Store, private responsive: BreakpointObserver) {}

  ngOnInit() {
    this.store.dispatch(fetchRecipes({ loading: true }));
    this.store.dispatch(fetchUserInfo({ loading: true }));
    this.user$.pipe(untilDestroyed(this)).subscribe((user) => {
      this.user = user;
    });
    this.userFromDb$.pipe(untilDestroyed(this)).subscribe((user) => {
      if (user?.user?.favorites.length > 0) {
        this.favoriteRecipes = user.user.favorites;
      }
    });
    setTimeout(() => (this.imgsState = 'end'), 1000);
  }

  onDrop(event: CdkDragDrop<Recipe[] | undefined, any, any>) {
    if (event.container.data) {
      const containerData = [...event.container.data];
      moveItemInArray(containerData, event.previousIndex, event.currentIndex);
      if (this.user.info.email && event.container.data) {
        this.store.dispatch(
          updateFavorites({
            email: this.user.info.email,
            recipes: containerData,
            loading: true,
          })
        );
      }
    }
  }

  onDelete(recipeId: string | undefined) {
    const filteredFavorites = this.favoriteRecipes?.filter(
      (recipe) => recipe.id !== recipeId
    );
    if (this.user.info.email && filteredFavorites) {
      this.store.dispatch(
        updateFavorites({
          email: this.user.info.email,
          recipes: filteredFavorites,
          loading: true,
        })
      );
    }
  }

  onLogin() {
    this.store.dispatch(logInWithGoogle({ loading: true }));
  }

  onLogOut() {
    this.store.dispatch(logOutWithGoogle({ loading: true }));
  }
}
