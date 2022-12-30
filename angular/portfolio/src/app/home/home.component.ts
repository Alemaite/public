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

  timeTrackingImages = ['home', 'home-logged-in', 'login'];
  timeTrackingHandsetImages = [
    'handset-home',
    'handset-home-logged-in',
    'handset-login',
  ];
  timeTrackingActiveImage = 'home';
  timeTrackingHandsetActiveImage = 'handset-home';
  timeTrackingImageIndex = 0;
  moveLeftTimeTracking = false;
  moveRightTimeTracking = false;
  zoomedInTimeTracking = false;

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
    if (project === 'online-shop') {
      this.zoomedInOnlineShop = !this.zoomedInOnlineShop;
      return;
    }
    if (project === 'time-tracking') {
      this.zoomedInTimeTracking = !this.zoomedInTimeTracking;
      return;
    }
    return;
  }

  onImageChange(action: string, project: string) {
    if (
      project === 'online-shop' &&
      action === 'next' &&
      this.onlineShopImageIndex < 5
    ) {
      this.nextOnlineShopImage();
      return;
    }
    if (
      project === 'online-shop' &&
      action === 'previous' &&
      this.onlineShopImageIndex > 0
    ) {
      this.previousOnlineShopImage();
      return;
    }
    if (
      project === 'time-tracking' &&
      action === 'next' &&
      this.timeTrackingImageIndex < 2
    ) {
      this.nextTimeTrackingImage();
      return;
    }
    if (
      project === 'time-tracking' &&
      action === 'previous' &&
      this.timeTrackingImageIndex > 0
    ) {
      this.previousTimeTrackingImage();
      return;
    }
    return;
  }

  nextOnlineShopImage() {
    this.onlineShopImageIndex++;
    this.moveRightOnlineShop = true;
    setTimeout(() => this.resetMoveStatus('online-shop'), 250);
    if (this.handsetMode === false) {
      return setTimeout(
        () =>
          (this.onlineShopActiveImage =
            this.onlineShopImages[this.onlineShopImageIndex]),
        250
      );
    }
    if (this.handsetMode === true) {
      return setTimeout(
        () =>
          (this.onlineShopHandsetActiveImage =
            this.onlineShopHandsetImages[this.onlineShopImageIndex]),
        250
      );
    }
    return;
  }

  previousOnlineShopImage() {
    this.onlineShopImageIndex--;
    this.moveLeftOnlineShop = true;
    setTimeout(() => this.resetMoveStatus('online-shop'), 250);
    if (this.handsetMode === false) {
      return setTimeout(
        () =>
          (this.onlineShopActiveImage =
            this.onlineShopImages[this.onlineShopImageIndex]),
        250
      );
    }
    if (this.handsetMode === true) {
      return setTimeout(
        () =>
          (this.onlineShopHandsetActiveImage =
            this.onlineShopHandsetImages[this.onlineShopImageIndex]),
        250
      );
    }
    return;
  }

  nextTimeTrackingImage() {
    this.timeTrackingImageIndex++;
    this.moveRightTimeTracking = true;
    setTimeout(() => this.resetMoveStatus('time-tracking'), 250);
    if (this.handsetMode === false) {
      return setTimeout(
        () =>
          (this.timeTrackingActiveImage =
            this.timeTrackingImages[this.timeTrackingImageIndex]),
        250
      );
    }
    if (this.handsetMode === true) {
      return setTimeout(
        () =>
          (this.timeTrackingHandsetActiveImage =
            this.timeTrackingHandsetImages[this.timeTrackingImageIndex]),
        250
      );
    }
    return;
  }

  previousTimeTrackingImage() {
    this.timeTrackingImageIndex--;
    this.moveLeftTimeTracking = true;
    setTimeout(() => this.resetMoveStatus('time-tracking'), 250);
    if (this.handsetMode === false) {
      return setTimeout(
        () =>
          (this.timeTrackingActiveImage =
            this.timeTrackingImages[this.timeTrackingImageIndex]),
        250
      );
    }
    if (this.handsetMode === true) {
      return setTimeout(
        () =>
          (this.timeTrackingHandsetActiveImage =
            this.timeTrackingHandsetImages[this.timeTrackingImageIndex]),
        250
      );
    }
    return;
  }

  resetMoveStatus(project: string) {
    if (project === 'online-shop') {
      this.moveLeftOnlineShop = false;
      this.moveRightOnlineShop = false;
      return;
    }
    if (project === 'time-tracking') {
      this.moveLeftTimeTracking = false;
      this.moveRightTimeTracking = false;
      return;
    }
    return;
  }
}
