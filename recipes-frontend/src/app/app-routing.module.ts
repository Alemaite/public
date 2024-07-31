import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeComponent } from './recipe/recipe.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  { path: '', component: RecipesListComponent },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: 'recipes/:id',
    loadComponent: () =>
      import('./recipe/recipe.component').then((m) => m.RecipeComponent),
  },
  {
    path: 'shopping-list',
    loadComponent: () =>
      import('./shopping-list/shopping-list.component').then(
        (m) => m.ShoppingListComponent
      ),
  },
  {
    path: 'charts',
    loadComponent: () =>
      import('./charts/charts.component').then((m) => m.ChartsComponent),
  },
  // routes to home page in case of invalid route
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
