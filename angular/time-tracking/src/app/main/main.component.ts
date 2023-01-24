import { Component, OnDestroy, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Activity } from './activity.model';
import { TimerService } from './timer.service';
import { min, Subscription } from 'rxjs';
import { ActivityService } from './activity.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, OnDestroy {
  handsetMode = false;
  activities: Activity[] = [];
  email: string | undefined;
  userId: string | undefined;

  timer: {
    hours: any;
    minutes: any;
    seconds: any;
  } = {
    hours: 0,
    minutes: 0,
    seconds: 0,
  };

  errorMessage: {
    hasError: boolean;
    message: string;
  } = {
    hasError: false,
    message: '',
  };

  currentActivity = '';
  activityActive = false;
  intervalId: any = null;

  timerServiceSub: Subscription = Subscription.EMPTY;
  emailSub: Subscription = Subscription.EMPTY;
  activitiesSub: Subscription = Subscription.EMPTY;

  constructor(
    private timerService: TimerService,
    private activityService: ActivityService,
    private authService: AuthService,
    private responsive: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.getLoggedInUserId();
    this.email = this.authService.getLoggedInEmail();
    this.activityService.getAllActivities(this.userId);

    this.activitiesSub = this.activityService.activitiesSubj.subscribe(
      (activities) => {
        const reverseActivities = activities.reverse();
        this.activities = reverseActivities;
      }
    );
    this.timerServiceSub = this.timerService.seconds.subscribe(
      (seconds: number) => {
        this.timer.seconds = seconds;
        if (seconds === 59) {
          this.timer.minutes++;
          this.timer.seconds = 0;
        }
        if (this.timer.minutes === 59 && seconds === 59) {
          this.timer.hours++;
          this.timer.minutes = 0;
        }
      }
    );
    this.emailSub = this.authService.emailSubj.subscribe(
      (response: string | undefined) => {
        this.email = response;
      }
    );
    this.responsive
      .observe([Breakpoints.HandsetLandscape, Breakpoints.HandsetPortrait])
      .subscribe((result) => {
        if (result.matches) {
          this.handsetMode = true;
        }
        return;
      });
  }

  deleteActivity(index: number) {
    if (this.activityActive) {
      this.errorMessage = {
        hasError: true,
        message: "You can't delete an active activity.",
      };
      return;
    }
    if (index < 0) {
      this.errorMessage = {
        hasError: true,
        message: 'Invalid activity index. Please reload page.',
      };
      return;
    }
    if (!this.userId) {
      this.activities.splice(index, 1);
      return;
    }

    this.activityService.deleteActivity(
      this.activities[index]._id,
      this.userId
    );
  }

  onStartClick() {
    if (this.activityActive) {
      this.errorMessage = {
        hasError: true,
        message: 'You are already tracking an activity.',
      };
      return;
    }
    if (this.currentActivity.trim() === '') {
      this.errorMessage = {
        hasError: true,
        message: 'Your activity needs to have at least 1 character.',
      };
      return;
    }
    if (this.currentActivity.trim().length > 15) {
      this.errorMessage = {
        hasError: true,
        message: 'Your activity may have no more than 15 characters.',
      };
      return;
    }
    this.errorMessage.hasError = false;
    this.activityActive = true;
    this.startTimer();
    let hours: any = new Date().getHours();
    let minutes: any = new Date().getMinutes();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let getFrom = hours + ':' + minutes;

    this.activities.unshift({
      activity: this.currentActivity,
      from: getFrom,
      to: '',
      time: '',
      date: new Date().toLocaleDateString('de-DE'),
    });
    this.currentActivity = '';
    return;
  }

  startTimer() {
    this.intervalId = setInterval(() => {
      this.timerService.seconds.next(this.timer.seconds + 1);
    }, 1000);
  }

  onStopClick() {
    if (!this.activityActive) {
      return;
    }
    clearInterval(this.intervalId);
    this.timer = {
      seconds: 0,
      minutes: 0,
      hours: 0,
    };
    this.activityActive = false;
    let hours: any = new Date().getHours();
    let minutes: any = new Date().getMinutes();

    if (hours < 10) {
      hours = '0' + hours;
    }
    if (minutes < 10) {
      minutes = '0' + minutes;
    }
    let getTo: string = hours + ':' + minutes;
    this.activities[0].to = getTo;
    console.log(this.activities[0].to);
    this.activities[0].time = this.timeDifference();
    console.log(this.activities[0].time);
    this.activities[0].user = this.email;
    this.activities[0].userId = this.userId;
    if (!this.email) {
      return;
    }
    this.activityService.createActivity(this.activities[0], this.userId);
  }

  onLog() {
    console.log(this.activities[0].date);
  }

  timeDifference() {
    let hours: any = null;
    let minutes = null;
    let differenceInMinutes: any =
      Number(this.activities[0].to.slice(0, 2)) * 60 -
      Number(this.activities[0].from.slice(0, 2)) * 60 +
      (Number(this.activities[0].to.slice(3, 5)) -
        Number(this.activities[0].from.slice(3, 5)));

    if (differenceInMinutes < 60) {
      hours = '00:';
      minutes = differenceInMinutes;
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      return hours + minutes;
    }

    if (differenceInMinutes >= 60) {
      hours = Math.floor(differenceInMinutes / 60);
      minutes = differenceInMinutes % 60;
    }

    if (hours < 10) {
      hours = '0' + hours + ':';
    }
    return hours + minutes;
  }

  ngOnDestroy(): void {
    this.emailSub.unsubscribe();
    this.timerServiceSub.unsubscribe();
    this.activitiesSub.unsubscribe();
    this.onStopClick();
  }
}
