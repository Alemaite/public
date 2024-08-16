import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/models/user';
import { Recipe } from 'src/app/models/recipe';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, mergeMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {
  userFromDbBS = new BehaviorSubject<User>(new User());
  userFromDb$ = this.userFromDbBS.asObservable();
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(email: string) {
    return this.http.get<User>(`${this.apiUrl}/api/user?email=${email}`);
  }

  createUser(user: User) {
    return this.http.post<User>(`${this.apiUrl}/api/login`, user);
  }

  // TODO: move logic completely to the backend
  addUserIfDoesNotExist(fullName: string, email: string): Observable<User> {
    return this.getUser(email).pipe(
      switchMap((user) => {
        if (!user) {
          const newUser = new User(fullName, email);
          return this.createUser(newUser).pipe(
            mergeMap((newCreatedUser) => {
              return of(newCreatedUser);
            })
          );
        }
        return of(user);
      })
    );
  }

  addRecipeToFavorites(email: string, recipe: Recipe): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/favorites`, {
      email,
      recipe,
    });
  }

  updateFavorites(email: string, recipes: Recipe[]): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/api/updatefavorites`, {
      email,
      recipes,
    });
  }
}
