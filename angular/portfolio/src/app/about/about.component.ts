import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
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
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('mouseOver', [
      state(
        'hover',
        style({ boxShadow: '-0.3rem 0.4rem 0.2rem rgba(230, 120, 50, 0.5)' })
      ),
      transition('normal => hover', [
        animate(
          0,
          keyframes([
            style({
              boxShadow: '-0.3rem 0.4rem 0.2rem rgba(230, 120, 50, 0.5)',
            }),
          ])
        ),
      ]),
    ]),
  ],
})
export class AboutComponent implements OnInit {
  age: number = 0;
  currentDate = new Date();
  yearOfBirth = new Date();
  handsetMode = false;
  isLoading = false;
  submitted = false;
  error = false;
  hoverElements = { gitHub: false, xing: false, linkedin: false };

  constructor(
    private responsive: BreakpointObserver,
    private http: HttpClient,
    private dropdownService: DropdownService
  ) {}

  ngOnInit(): void {
    this.yearOfBirth.setTime(0);
    this.yearOfBirth.setDate(16);
    this.yearOfBirth.setMonth(5);
    this.yearOfBirth.setFullYear(1989);

    if (this.yearOfBirth.getMonth() >= this.currentDate.getMonth()) {
      this.age =
        this.currentDate.getFullYear() - this.yearOfBirth.getFullYear() - 1;
    }
    if (this.yearOfBirth.getMonth() < this.currentDate.getMonth()) {
      this.age =
        this.currentDate.getFullYear() - this.yearOfBirth.getFullYear();
    }

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

  onHover(element: string) {
    if (element === 'github') {
      return (this.hoverElements.gitHub = true);
    }
    if (element === 'xing') {
      return (this.hoverElements.xing = true);
    }
    if (element === 'linkedin') {
      return (this.hoverElements.linkedin = true);
    }
    return;
  }

  onHoverLeave(element: string) {
    if (element === 'github') {
      return (this.hoverElements.gitHub = false);
    }
    if (element === 'xing') {
      return (this.hoverElements.xing = false);
    }
    if (element === 'linkedin') {
      return (this.hoverElements.linkedin = false);
    }
    return;
  }

  onSubmit(contactForm: NgForm) {
    this.isLoading = true;
    this.http
      .post('https://mailthis.to/JustAnOtter', contactForm.value, {
        responseType: 'text',
      })
      .subscribe(
        () => {
          this.isLoading = false;
          this.submitted = true;
          return (location.href = 'https://mailthis.to/confirm');
        },
        (error) => {
          this.isLoading = false;
          return (this.error = true);
        }
      );
  }
}
