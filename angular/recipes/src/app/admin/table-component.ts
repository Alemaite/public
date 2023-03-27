import {
  Component,
  ViewContainerRef,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { IngredientsModel } from '../models/ingredients';
import { AdminService } from './admin.service';
import { TableRowComponent } from './table-row-component';

@Component({
  selector: 'new-table',
  styleUrls: ['./admin.component.css'],
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title
          (keydown.Space)="$event.stopImmediatePropagation()"
          #recipeTitle
        >
          <mat-form-field class="name">
            <input matInput placeholder="New Recipe Title" value="" />
          </mat-form-field>
        </mat-panel-title>
      </mat-expansion-panel-header>
      <table #newTable class="mat-table mat-elevation-z8">
        <tr class="mat-header-row">
          <th class="mat-header-cell">Quantity</th>
          <th class="mat-header-cell">Unit</th>
          <th class="mat-header-cell">Name</th>
        </tr>
        <br />
        <ng-container #parent2></ng-container>
      </table>
      <br />
      <div class="btn-ctn">
        <button mat-raised-button color="basic" (click)="onSubmitNewTable()">
          Add
        </button>
        <button mat-raised-button color="basic" (click)="onAddTableRow()">
          Add Row
        </button>
        <button mat-raised-button color="warn">Cancel</button>
      </div>
    </mat-expansion-panel>
  `,
})
export class TableComponent {
  @ViewChild('parent2', { read: ViewContainerRef }) target2: any;
  @ViewChild('recipeTitle') recipeTitle: ElementRef = {} as ElementRef;
  @ViewChild('newTable') newTable: any;

  constructor(private adminService: AdminService) {}

  onAddTableRow() {
    return this.target2.createComponent(TableRowComponent);
  }

  onSubmitNewTable() {
    const recipeTitle =
      this.recipeTitle.nativeElement.children[0].children[0].children[0]
        .children[0].children[0].value;
    const colLength =
      this.newTable.nativeElement.children[2].children[0].children.length;
    const rowLength = this.newTable.nativeElement.children.length;
    const ingredients: any = [];
    const arrayProperties = ['quantity', 'unit', 'name'];
    for (let e = 2; e < rowLength; e++) {
      ingredients.push({ quantity: null, unit: null, name: null });

      for (let i = 0; i < colLength; i++) {
        ingredients[e - 2][arrayProperties[i]] =
          this.newTable.nativeElement.children[e].children[0].children[
            i
          ].children[0].children[0].children[0].children[0].children[0].value;
      }
      ingredients[e - 2].quantity = Number(ingredients[e - 2].quantity);
    }
    const recipe: IngredientsModel = {
      title: recipeTitle,
      ingredients: ingredients,
    };
    return this.adminService.postRecipe(recipe);
    // return console.log(recipe);
  }
}
