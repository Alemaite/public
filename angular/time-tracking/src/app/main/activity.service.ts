import { Injectable } from '@angular/core';
import { Activity } from './activity.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private activity: Activity = { activity: '', from: '', to: '', time: '' };
  private activities: Activity[] = [];

  activitiesSubj = new Subject<Activity[]>();

  constructor(private http: HttpClient) {}

  deleteActivity(activityId: string | undefined, userId: string | undefined) {
    if (!activityId || !userId) {
      return;
    }
    const activId = { actId: activityId };
    this.http
      .post<{}>('http://localhost:3000/api/activities/delete', activId)
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
      .get<Activity[]>('http://localhost:3000/api/activities/' + userId)
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
        'http://localhost:3000/api/activities',
        activity
      )
      .subscribe(() => {
        this.getAllActivities(userId);
      });
  }
}
