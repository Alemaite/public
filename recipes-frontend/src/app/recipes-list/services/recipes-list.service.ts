import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Page } from 'src/app/models/page';
import { Recipe } from 'src/app/models/recipe';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipesListService {
  private filterBS = new BehaviorSubject<string>('');
  filter$ = this.filterBS.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  readAll() {
    return this.http.get<Recipe[]>(`${this.apiUrl}/api/recipes`);
  }

  read(page: number, size: number, search: string) {
    return this.http.get<{ content: Recipe[]; page: Page }>(
      `${this.apiUrl}/api/recipes/page?page=${page}&size=${size}&search=${search}`
    );
  }

  create(recipe: Recipe) {
    return this.http.post<Recipe>(`${this.apiUrl}/api/recipes`, recipe);
  }

  update(recipe: Recipe) {
    return this.http.put<Recipe>(
      `${this.apiUrl}/api/recipes/${recipe.id}`,
      recipe
    );
  }

  delete(ids: string[]) {
    return this.http.delete(
      `${this.apiUrl}/api/recipes?ids=${ids.join('&ids=')}`
    );
  }

  filterUtil(search: string) {
    this.filterBS.next(search);
  }
}
