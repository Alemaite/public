import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Recipe } from 'src/app/models/recipe';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class RecipeService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  read(id: string) {
    return this.http.get<Recipe>(`${this.apiUrl}/api/recipes/${id}`);
  }
}
