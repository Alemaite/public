import { TestBed } from '@angular/core/testing';
import { RecipesListService } from './recipes-list.service';
import { Recipe } from 'src/app/models/recipe';
import { Page } from 'src/app/models/page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment';

describe('RecipesListService', () => {
  let recipesListService: RecipesListService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RecipesListService],
    });
    recipesListService = TestBed.inject(RecipesListService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should return all recipes in an Array', () => {
    const apiUrl = environment.apiUrl;
    const recipes = [];
    recipes.push(new Recipe());
    let savedResponse;
    recipesListService.readAll().subscribe((response) => {
      savedResponse = response;
    });
    const req = httpTestingController.expectOne(`${apiUrl}/api/recipes`);
    req.flush(recipes);
    expect(savedResponse).toEqual(recipes);
  });

  it('should return recipes as a page', () => {
    const apiUrl = environment.apiUrl;
    const recipes = [];
    const page: Page = { number: 1, size: 10, totalElements: 1, totalPages: 1 };
    recipes.push(new Recipe());
    let savedResponse;
    recipesListService.read(1, 10, 'search').subscribe((response) => {
      savedResponse = response;
    });
    const req = httpTestingController.expectOne(
      `${apiUrl}/api/recipes/page?page=1&size=10&search=search`
    );
    req.flush({ content: recipes, page: page });
    expect(savedResponse).toEqual({
      content: recipes,
      page: page,
    });
  });

  it('should create a recipe', () => {
    const apiUrl = environment.apiUrl;
    const recipe = new Recipe();
    let savedResponse;
    recipesListService.create(recipe).subscribe((response) => {
      savedResponse = response;
    });
    const req = httpTestingController.expectOne(`${apiUrl}/api/recipes`);
    req.flush(recipe);
    expect(savedResponse).toEqual(recipe);
  });

  it('should update a recipe', () => {
    const apiUrl = environment.apiUrl;
    const recipe = new Recipe();
    let savedResponse;
    recipesListService.update(recipe).subscribe((response) => {
      savedResponse = response;
    });
    const req = httpTestingController.expectOne(
      `${apiUrl}/api/recipes/${recipe.id}`
    );
    req.flush(recipe);
    expect(savedResponse).toEqual(recipe);
  });

  it('should delete a recipe', () => {
    const apiUrl = environment.apiUrl;
    const ids = ['1'];
    let savedResponse;
    recipesListService.delete(ids).subscribe((response) => {
      savedResponse = response;
    });
    const req = httpTestingController.expectOne(`${apiUrl}/api/recipes?ids=1`);
    req.flush({});
    expect(savedResponse).toEqual({});
  });

  it('should pass on the search term', () => {
    const search = 'search';
    let savedResponse;
    recipesListService.filterUtil(search);
    recipesListService.filter$.subscribe((response) => {
      savedResponse = response;
    });
    expect(savedResponse).toEqual(search);
  });

  it('should create', () => {
    expect(recipesListService).toBeTruthy();
  });
});
