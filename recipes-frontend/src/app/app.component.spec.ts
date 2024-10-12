import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { StoreModule } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

describe('AppComponent', () => {
  beforeEach(async () => {
    const mockActivatedRoute = {};
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
      imports: [StoreModule.forRoot({}), RouterModule, MatIconModule],
      declarations: [AppComponent, HeaderComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
