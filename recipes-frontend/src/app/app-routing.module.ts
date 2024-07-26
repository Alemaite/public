import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipeComponent } from './recipe/recipe.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';
import { ChartsComponent } from './charts/charts.component';

const routes: Routes = [
  { path: '', component: RecipesListComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'recipes/:id', component: RecipeComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
  { path: 'charts', component: ChartsComponent },
  // routes to home page in case of invalid route
  { path: '**', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
