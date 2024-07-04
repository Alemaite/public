import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  handsetMode: boolean;
  landscapeMode: boolean;

  constructor(private responsive: BreakpointObserver) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetPortrait, Breakpoints.TabletPortrait])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          this.landscapeMode = false;
          return;
        }
        this.handsetMode = false;
      });
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.TabletLandscape])
      .pipe(untilDestroyed(this))
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          this.landscapeMode = true;
          return;
        }
        this.landscapeMode = false;
      });
  }
}
