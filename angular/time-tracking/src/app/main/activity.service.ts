import { Injectable } from '@angular/core';
import { Activity } from './activity.model';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private activity: Activity = {
    activity: '',
    from: '',
    to: '',
    time: '',
    date: null,
  };
  private activities: Activity[] = [];

  activitiesSubj = new Subject<Activity[]>();

  constructor(private http: HttpClient) {}

  deleteActivity(activityId: string | undefined, userId: string | undefined) {
    if (!activityId || !userId) {
      return;
    }
    const activId = { actId: activityId };
    this.http
      .post<{}>(
        'https://iu-time-tracking-api.click/api/activities/delete',
        activId
      )
      .subscribe(() => {
        this.getAllActivities(userId);
      });
  }

  clearActivitiesOnLogout() {
    this.activitiesSubj.next([]);
  }

  getAllActivities(userId: string | undefined) {
    if (!userId) {
      return;
    }
    this.http
      .get<Activity[]>(
        'https://iu-time-tracking-api.click/api/activities/' + userId
      )
      .pipe(
        map((response) => {
          function compareFn(a: any, b: any) {
            if (a.date < b.date) {
              return -1;
            }
            if (a.date > b.date) {
              return 1;
            }
            if (a.date === b.date) {
              return 0;
            }
            return 0;
          }
          response.sort(compareFn);
          return response;
        })
      )
      .subscribe((response) => {
        this.activitiesSubj.next(response);
      });
  }

  returnAllActivities() {
    return this.activities;
  }

  createActivity(activity: Activity, userId: string | undefined) {
    this.http
      .post<{ message: string }>(
        'https://iu-time-tracking-api.click/api/activities/',
        activity
      )
      .subscribe(() => {
        this.getAllActivities(userId);
      });
  }
}
