import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { DropdownService } from '../header/dropdown-service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.css'],
})
export class ProjectDetailsComponent implements OnInit {
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
}
