import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { Ingredient } from 'src/app/models/ingredient';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { units } from 'src/app/enums/unit.enums';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@UntilDestroy()
@Component({
  selector: 'app-ingredients-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatSelectModule,
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './ingredients-table.component.html',
  styleUrl: './ingredients-table.component.css',
})
export class IngredientsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatTable) table: MatTable<Ingredient>;
  @ViewChild('ingredientsForm') ingredientsForm: NgForm;
  @Input() set ingredients(ingredients: Ingredient[]) {
    this.ingredientsCopy = [...ingredients];
  }
  @Output() ingredientsChange = new EventEmitter<Ingredient[]>();
  @Output() ingredientsFormInvalid = new EventEmitter<boolean>();
  ingredientsCopy: Ingredient[] = [];
  units = units();
  selection = new SelectionModel<Ingredient>(true, []);
  displayedColumns = ['select', 'name', 'quantity', 'unit'];
  formChangesSubscription: Subscription;
  checkedRowsIndexes: number[] = [];
  handsetMode: boolean;

  get copyOfIngredients() {
    return this.ingredientsCopy;
  }

  constructor(private responsive: BreakpointObserver) {}

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

  ngAfterViewInit() {
    this.ingredientsForm.form.valueChanges
      .pipe(untilDestroyed(this))
      .subscribe(() => {
        if (this.ingredientsForm.form.invalid) {
          this.ingredientsFormInvalid.emit(true);
          return;
        }
        this.ingredientsFormInvalid.emit(false);
        this.ingredientsChange.emit(this.formValuesIntoIngredients());
      });
  }

  formValuesIntoIngredients(): Ingredient[] {
    const ingredients: Ingredient[] = [];
    const formControlArrayValues: any[] = [];
    const formControlArray = Object.values(this.ingredientsForm.form.controls);
    // push all form control values into an array, every 3 values represent an ingredient
    formControlArray.map((control) => {
      formControlArrayValues.push(control.value);
    });
    for (let i = 0; i < formControlArrayValues.length; i += 3) {
      const ingredient = new Ingredient(
        formControlArrayValues[i],
        formControlArrayValues[i + 1],
        formControlArrayValues[i + 2]
      );
      ingredients.push(ingredient);
    }
    return ingredients;
  }

  addIngredient() {
    this.ingredientsCopy.push(new Ingredient());
    this.table.renderRows();
  }

  deleteIngredients() {
    if (this.isAllSelected()) {
      this.ingredientsCopy = [];
      this.checkedRowsIndexes = [];
      this.selection.clear();
      return;
    }
    this.ingredientsCopy = this.ingredientsCopy.filter(
      (ingredient) =>
        !this.checkedRowsIndexes.includes(
          this.ingredientsCopy.indexOf(ingredient)
        )
    );
    this.checkedRowsIndexes = [];
    this.selection.clear();
  }

  // saves the index of the checked row in an array, removes it if the user unchecks it
  saveCheckedIndex($event: MatCheckboxChange, i: number) {
    if ($event.checked) {
      this.checkedRowsIndexes.push(i);
      return;
    }
    this.checkedRowsIndexes = this.checkedRowsIndexes.filter(
      (idx) => idx !== i
    );
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.ingredientsCopy.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    for (let i = 0; i < this.ingredientsCopy.length; i++) {
      this.checkedRowsIndexes.push(i);
    }

    this.selection.select(...this.ingredientsCopy);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Ingredient): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${
      row.name + 1
    }`;
  }
}
