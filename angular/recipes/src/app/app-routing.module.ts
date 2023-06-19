import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthComponent } from './auth/auth.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { RecipesComponent } from './recipes/recipes.component';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

const routes: Routes = [
  { path: '', component: RecipesListComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'recipes-list', component: RecipesListComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'recipes/:id', component: RecipesComponent },
  { path: 'shopping-list/:id', component: ShoppingListComponent },
  { path: 'shopping-list', component: ShoppingListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
