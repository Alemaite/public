import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { Recipe } from 'src/app/models/recipe';
import { CommonModule } from '@angular/common';
import { Ingredient } from 'src/app/models/ingredient';
import { IngredientsTableComponent } from './ingredients-table/ingredients-table.component';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import {
  createRecipe,
  createRecipeFrontendOnly,
  updateRecipe,
  updateRecipeFrontendOnly,
} from 'src/app/recipes-list/store/recipes-list.actions';
import { RecipeKeys } from 'src/app/enums/recipe-keys.enum';
import { recipeImages } from 'src/app/enums/recipe-images.enum';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    CommonModule,
    IngredientsTableComponent,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
@UntilDestroy()
export class EditDialogComponent implements OnInit {
  selectedIngredient: Ingredient;
  recipeImages = recipeImages();
  recipeImagePath: string;
  ingredients: Ingredient[] = [];
  ingredientsFormInvalid = false;
  handsetMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public dialogPayLoad: { recipe: Recipe; editMode?: boolean },
    private snackBar: MatSnackBar,
    private store: Store,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
      });
  }

  onImageChange($event: MatSelectChange) {
    this.recipeImagePath = $event.value;
  }

  onSave(recipeForm: NgForm): void {
    if (recipeForm.invalid || this.ingredientsFormInvalid) {
      this.snackBar.open('Please fill in all required fields');
      return;
    }

    const formValue: {
      'recipe-title': string;
      'recipe-desc': string | string[];
      'recipe-short-desc': string;
      'recipe-image-path': string;
    } = recipeForm.value;

    if (!Array.isArray(formValue['recipe-desc'])) {
      formValue['recipe-desc'] = [formValue['recipe-desc']];
    }

    const recipe = new Recipe(
      formValue['recipe-title'],
      this.dialogPayLoad.recipe.id,
      this.ingredients,
      formValue['recipe-desc'],
      formValue['recipe-short-desc'],
      formValue['recipe-image-path']
    );

    if (this.dialogPayLoad.editMode) {
      // this.store.dispatch(updateRecipe({ recipe }));
      // for demo purposes, only updating frontend
      this.store.dispatch(updateRecipeFrontendOnly({ recipe }));
      this.dialogRef.close();
      return;
    }

    // this.store.dispatch(createRecipe({ recipe }));
    // for demo purposes, only updating frontend
    this.store.dispatch(createRecipeFrontendOnly({ recipe }));
    this.dialogRef.close();
  }

  getIngredients(ingredients: Ingredient[]) {
    this.ingredients = ingredients;
  }

  getIngredientsFormStatus($event: boolean) {
    this.ingredientsFormInvalid = $event;
  }

  saveFrontEndOnly(recipeForm: NgForm) {
    const updatedRecipe = { ...this.dialogPayLoad.recipe };
    const keys: (keyof Recipe)[] = [
      RecipeKeys.TITLE,
      RecipeKeys.DESC,
      RecipeKeys.IMAGE_PATH,
    ];

    // Only title, desc, and image since those are the only ones being displayed in the admin component (frontend only) for demo purposes.
    for (let key of keys) {
      if (updatedRecipe[key] !== recipeForm.value['recipe-title']) {
        updatedRecipe.title = recipeForm.value['recipe-title'];
      }
      if (updatedRecipe[key] !== recipeForm.value['recipe-desc']) {
        updatedRecipe.desc = recipeForm.value['recipe-desc'];
      }
      if (updatedRecipe[key] !== recipeForm.value['recipe-image-path']) {
        updatedRecipe.imagePath = recipeForm.value['recipe-image-path'];
      }
    }
    this.store.dispatch(updateRecipeFrontendOnly({ recipe: updatedRecipe }));
    this.dialogRef.close();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
