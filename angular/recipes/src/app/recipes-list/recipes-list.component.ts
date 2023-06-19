import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AdminService } from '../admin/admin.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.css'],
})
export class RecipesListComponent implements OnInit {
  handsetMode = false;
  constructor(
    private responsive: BreakpointObserver,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
          return;
        }
        this.handsetMode = false;
        return;
      });
  }
}
