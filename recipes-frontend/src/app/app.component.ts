import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  handsetPortrait$ = this.responsive.observe([Breakpoints.HandsetPortrait]);

  constructor(private responsive: BreakpointObserver) {}
}
