import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './auth/auth.component';
import { RecipesComponent } from './recipes/recipes.component';
import { RecipesListComponent } from './recipes-list/recipes-list.component';
import { AdminComponent } from './admin/admin.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, NgModel } from '@angular/forms';
import { TableComponent } from './admin/table-component';
import { TableRowComponent } from './admin/table-row-component';
import { HttpClientModule } from '@angular/common/http';
import { ShoppingListComponent } from './shopping-list/shopping-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    RecipesComponent,
    RecipesListComponent,
    AdminComponent,
    TableComponent,
    TableRowComponent,
    ShoppingListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [TableComponent],
})
export class AppModule {}
