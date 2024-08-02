import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminComponent } from './admin.component';
import { provideMockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StoreModule } from '@ngrx/store';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Recipe } from '../models/recipe';
import { RouterModule } from '@angular/router';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;
  const dataSource: Recipe[] = [];
  const recipe = new Recipe();
  dataSource.push(recipe);
  let matDialogMock = {
    open: jest.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        MatCheckboxModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatInputModule,
        MatFormFieldModule,
        MatPaginatorModule,
        MatIconModule,
        HttpClientTestingModule,
        RouterModule,
        StoreModule.forRoot({}),
      ],
      providers: [
        provideMockStore(),
        { provide: MatDialog, useValue: matDialogMock },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    component.recipes = dataSource;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
