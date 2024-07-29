import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  handset$ = this.responsive.observe([
    Breakpoints.HandsetPortrait,
    Breakpoints.TabletPortrait,
    Breakpoints.HandsetLandscape,
    Breakpoints.TabletLandscape,
  ]);

  constructor(private responsive: BreakpointObserver) {}
}
