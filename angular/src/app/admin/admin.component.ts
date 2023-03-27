import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewContainerRef,
} from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { ObjectId } from 'mongoose';
import { IngredientsModel } from '../models/ingredients';
import { AdminService } from './admin.service';
import { TableComponent } from './table-component';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  styles: ['new-row {display: contents}'],
})
export class AdminComponent implements OnInit {
  recipes: any = [];
  displayedColumns: string[] = ['quantity', 'unit', 'name'];
  dataSource = [
    { quantity: 2, unit: 'large', name: 'Potatoes' },
    { quantity: 200, unit: 'g', name: 'Flour' },
    { quantity: 3, unit: 'tsp', name: 'Salt' },
  ];
  // recipeData = { index: Number, quantity: Number };
  recipeData: any = {};
  editMode = false;
  componentRef: any;

  @ViewChild('parent', { read: ViewContainerRef }) target: any;
  @ViewChild('recipeTitle') recipeTitle: ElementRef = {} as ElementRef;
  @ViewChild('recipeQuantity') recipeQuantity: ElementRef<HTMLInputElement> =
    {} as ElementRef;
  @ViewChild('matPanel') matPanel: ElementRef<MatExpansionPanel> =
    {} as ElementRef;
  @ViewChild('table') table: any;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.adminService.getAllRecipes();
    this.adminService.recipes.subscribe((recipes) => {
      this.recipes = recipes;
    });
  }

  onDelete(id: ObjectId) {
    this.adminService.deleteRecipe(id);
  }

  onAddTable() {
    return this.target.createComponent(TableComponent);
  }

  onEdit(title: HTMLElement, table: any) {
    return (this.editMode = !this.editMode);
  }

  onSubmit() {
    const recipeTitle =
      this.recipeTitle.nativeElement.children[0].children[0].children[0]
        .children[0].children[0].value;
    const columnLength =
      this.table._elementRef.nativeElement.children[1].children[0].children
        .length;
    const rowLength =
      this.table._elementRef.nativeElement.children[1].children.length;
    const ingredients: any = [];
    const arrayProperties = ['quantity', 'unit', 'name'];

    for (let e = 0; e < rowLength; e++) {
      ingredients.push({ quantity: 0, unit: '', name: '' });
      for (let i = 0; i < columnLength; i++) {
        ingredients[e][arrayProperties[i]] =
          this.table._elementRef.nativeElement.children[1].children[e].children[
            i
          ].children[1].children[0].children[0].children[0].children[0].value;
      }
      ingredients[e].quantity = Number(ingredients[e].quantity);
    }
    const recipe: IngredientsModel = {
      title: recipeTitle,
      ingredients: ingredients,
    };
    return this.adminService.postRecipe(recipe);
  }

  onLog() {
    console.log(this.recipes);
  }
}
