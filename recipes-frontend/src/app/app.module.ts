import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_SNACK_BAR_DEFAULT_OPTIONS,
  MatSnackBarModule,
} from '@angular/material/snack-bar';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { RecipeComponent } from './recipe/recipe.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { StoreModule } from '@ngrx/store';
import {
  recipesListPageReducer,
  recipesListReducer,
} from './recipes-list/store/recipes-list.reducer';
import { EffectsModule } from '@ngrx/effects';
import { RecipesListEffects } from './recipes-list/store/recipes-list.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { recipeReducer, triggerReducer } from './recipe/store/recipe.reducer';
import { RecipeEffects } from './recipe/store/recipe.effects';
import { shoppingListReducer } from './shopping-list/store/shopping-list.reducer';
import { ShoppingListEffects } from './shopping-list/store/shopping-list.effects';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipeComponent,
    RecipesListComponent,
    AdminComponent,
    ShoppingListComponent,
  ],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatPaginatorModule,
    ClipboardModule,
    MatTooltipModule,
    MatInputModule,
    MatFormFieldModule,
    SpinnerComponent,
    StoreModule.forRoot({
      shoppingListReducer: shoppingListReducer,
      triggerReducer: triggerReducer,
      recipeReducer: recipeReducer,
      recipesListReducer: recipesListReducer,
      recipesListPageReducer: recipesListPageReducer,
    }),
    EffectsModule.forRoot([
      ShoppingListEffects,
      RecipeEffects,
      RecipesListEffects,
    ]),
    StoreDevtoolsModule.instrument({ logOnly: true }),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 2500,
        horizontalPosition: 'start',
        panelClass: ['snackbar'],
      },
    },
  ],
})
export class AppModule {}
