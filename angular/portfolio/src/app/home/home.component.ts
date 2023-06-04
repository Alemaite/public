import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { DropdownService } from '../header/dropdown-service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  animations: [
    trigger('moveSlide', [
      transition('normal => rightarrow', [
        animate(
          200,
          keyframes([
            style({
              transform: 'translateX(25%)',
              offset: 0.15,
            }),
            style({ transform: 'translateX(50%)', offset: 0.3 }),
            style({ transform: 'translateX(75%)', offset: 0.45 }),
            style({ transform: 'translateX(50%)', offset: 0.6 }),
            style({ transform: 'translateX(25%)', offset: 0.75 }),
            style({ transform: 'translateX(0%)', offset: 1 }),
          ])
        ),
      ]),
      transition('normal => leftarrow', [
        animate(
          200,
          keyframes([
            style({
              transform: 'translateX(-25%)',
              offset: 0.15,
            }),
            style({ transform: 'translateX(-50%)', offset: 0.3 }),
            style({ transform: 'translateX(-75%)', offset: 0.45 }),
            style({ transform: 'translateX(-50%)', offset: 0.6 }),
            style({ transform: 'translateX(-25%)', offset: 0.75 }),
            style({ transform: 'translateX(0%)', offset: 1 }),
          ])
        ),
      ]),
      transition('normal => slideonrightarrow', [
        animate(
          1000,
          keyframes([
            style({
              transform: 'translateX(-1000%)',
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class HomeComponent implements OnInit {
  // recipes variables

  recipesImages = ['home', 'details', 'shopping-list', 'admin'];
  recipesHandsetImages = [
    'handset-home',
    'handset-details',
    'handset-shopping-list',
    'handset-admin',
  ];
  recipesActiveImage = 'home';
  recipesHandsetActiveImage = 'handset-home';
  recipesImageIndex = 0;
  moveLeftRecipes = false;
  moveRightRecipes = false;
  zoomedInRecipes = false;

  // time tracking variables

  timeTrackingImages = ['home-logged-in', 'login'];
  timeTrackingHandsetImages = ['handset-home-logged-in', 'handset-login'];
  timeTrackingActiveImage = 'home-logged-in';
  timeTrackingHandsetActiveImage = 'handset-home-logged-in';
  timeTrackingImageIndex = 0;
  moveLeftTimeTracking = false;
  moveRightTimeTracking = false;
  zoomedInTimeTracking = false;

  // online shop variables

  onlineShopImages = [
    'products',
    'order-history',
    'cart',
    'admin-order-overview',
    'admin-edit-products',
    'admin-add-products',
  ];
  onlineShopHandsetImages = [
    'handset-products',
    'handset-order-history',
    'handset-cart',
    'handset-admin-overview',
    'handset-admin-edit-products',
    'handset-admin-add-products',
  ];
  onlineShopActiveImage = 'products';
  onlineShopHandsetActiveImage = 'handset-products';
  onlineShopImageIndex = 0;
  moveLeftOnlineShop = false;
  moveRightOnlineShop = false;
  zoomedInOnlineShop = false;

  isLoading = { recipes: false, timeTracking: false, onlineShop: false };

  zoomedIn = false;
  handsetMode = false;

  constructor(
    private responsive: BreakpointObserver,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
        }
      });
  }

  onMainClick(status: boolean) {
    return this.dropdownService.dropdownActive.next(status);
  }

  onZoomIn(project: string) {
    this.zoomedIn = !this.zoomedIn;
    switch (project) {
      case 'recipes':
        this.zoomedInRecipes = !this.zoomedInRecipes;
        break;
      case 'time-tracking':
        this.zoomedInTimeTracking = !this.zoomedInTimeTracking;
        break;
      case 'online-shop':
        this.zoomedInOnlineShop = !this.zoomedInOnlineShop;
        break;
    }
    return;
  }

  onLoadingFinished() {
    this.isLoading = { recipes: false, timeTracking: false, onlineShop: false };
  }

  onImageChange(action: string, project: string) {
    if (action === 'next') {
      this.nextImage(project);
      return;
    }
    if (action === 'previous') {
      this.previousImage(project);
      return;
    }
    return;
  }

  nextImage(project: string) {
    switch (project) {
      case 'recipes':
        if (this.recipesImageIndex < 3) {
          this.isLoading.recipes = true;
          this.recipesImageIndex++;
          this.moveRightRecipes = true;
        }
        break;
      case 'time-tracking':
        if (this.timeTrackingImageIndex < 1) {
          this.isLoading.timeTracking = true;
          this.timeTrackingImageIndex++;
          this.moveRightTimeTracking = true;
        }
        break;
      case 'online-shop':
        if (this.onlineShopImageIndex < 5) {
          this.isLoading.onlineShop = true;
          this.onlineShopImageIndex++;
          this.moveRightOnlineShop = true;
        }
        break;
    }
    this.updateImageIndex();
    setTimeout(() => this.resetMoveStatus(project), 250);

    return;
  }

  previousImage(project: string) {
    switch (project) {
      case 'recipes':
        if (this.recipesImageIndex > 0) {
          this.isLoading.recipes = true;
          this.recipesImageIndex--;
          this.moveLeftRecipes = true;
        }
        break;
      case 'time-tracking':
        if (this.timeTrackingImageIndex > 0) {
          this.isLoading.timeTracking = true;
          this.timeTrackingImageIndex--;
          this.moveLeftTimeTracking = true;
        }
        break;
      case 'online-shop':
        if (this.onlineShopImageIndex > 0) {
          this.isLoading.onlineShop = true;
          this.onlineShopImageIndex--;
          this.moveLeftOnlineShop = true;
        }
        break;
    }
    this.updateImageIndex();
    setTimeout(() => this.resetMoveStatus(project), 250);

    return;
  }

  updateImageIndex() {
    if (this.handsetMode === false) {
      setTimeout(
        () => (
          (this.recipesActiveImage =
            this.recipesImages[this.recipesImageIndex]),
          (this.timeTrackingActiveImage =
            this.timeTrackingImages[this.timeTrackingImageIndex]),
          (this.onlineShopActiveImage =
            this.onlineShopImages[this.onlineShopImageIndex])
        ),
        250
      );
    }
    if (this.handsetMode === true) {
      setTimeout(
        () => (
          (this.recipesHandsetActiveImage =
            this.recipesHandsetImages[this.recipesImageIndex]),
          (this.timeTrackingHandsetActiveImage =
            this.timeTrackingHandsetImages[this.timeTrackingImageIndex]),
          (this.onlineShopHandsetActiveImage =
            this.onlineShopHandsetImages[this.onlineShopImageIndex])
        ),
        250
      );
    }
    return;
  }

  resetMoveStatus(project: string) {
    if (project === 'recipes') {
      this.moveLeftRecipes = false;
      this.moveRightRecipes = false;
      return;
    }
    if (project === 'time-tracking') {
      this.moveLeftTimeTracking = false;
      this.moveRightTimeTracking = false;
      return;
    }
    if (project === 'online-shop') {
      this.moveLeftOnlineShop = false;
      this.moveRightOnlineShop = false;
      return;
    }
    return;
  }
}
