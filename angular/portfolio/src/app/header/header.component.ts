import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DropdownService } from './dropdown-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  animations: [
    trigger('mouseOverLinks', [
      state(
        'mouseover',
        style({
          background: 'rgba(255, 255, 255, 0.1)',
          borderLeft: 'white solid 0.05rem',
          borderRight: 'white solid 0.05rem',
        })
      ),
      transition('normal => mouseover', [
        animate(
          200,
          keyframes([
            style({
              background: 'rgba(255, 255, 255, 0.1)',
              borderLeft: 'white solid 0.05rem',
              borderRight: 'white solid 0.05rem',
              offset: 1,
            }),
          ])
        ),
      ]),
      transition('mouseover => normal', [animate(200)]),
    ]),
    trigger('clickHamburgerIcon', [
      state(
        'open',
        style({
          transform: 'rotate(90deg)',
        })
      ),
      transition('normal => open', [
        animate(200, keyframes([style({ transform: 'rotate(90deg)' })])),
      ]),
      transition('open => normal', [
        animate(200, keyframes([style({ transform: 'rotate(180deg)' })])),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit, OnDestroy {
  dropdownServiceSub: any;
  mouseOver = {
    home: false,
    projects: false,
    about: false,
  };
  handSetMode = false;
  hamburgerIconOpen = false;
  dropdown = false;

  constructor(
    private responsive: BreakpointObserver,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          return (this.handSetMode = true);
        }
        return (this.handSetMode = false);
      });

    this.dropdownServiceSub = this.dropdownService.dropdownActive.subscribe(
      (status: boolean) => {
        return (this.dropdown = status);
      }
    );
  }

  ngOnDestroy(): void {
    this.dropdownServiceSub.unsubscribe();
  }

  onHamburgerClick() {
    this.hamburgerIconOpen = !this.hamburgerIconOpen;
  }

  onMouseOver(navBarItem: string) {
    if (navBarItem === 'home') {
      return (this.mouseOver.home = true);
    }
    if (navBarItem === 'projects') {
      this.dropdown = true;
      return (this.mouseOver.projects = true);
    }
    if (navBarItem === 'about') {
      return (this.mouseOver.about = true);
    }
    return;
  }

  onMouseLeave(navBarItem: string) {
    if (navBarItem === 'home') {
      return (this.mouseOver.home = false);
    }
    if (navBarItem === 'projects') {
      return (this.mouseOver.projects = false);
    }
    if (navBarItem === 'about') {
      return (this.mouseOver.about = false);
    }
    return;
  }

  onMouseLeaveDropdown() {
    return (this.dropdown = false);
  }
}
