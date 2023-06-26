import { Injectable } from '@angular/core';
import { Activity } from './activity.model';
import { HttpClient } from '@angular/common/http';
import { map, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  activitiesSubj = new Subject<Activity[]>();
  activitiesSubjNoQueryParams = new Subject<Activity[]>();

  constructor(private http: HttpClient) {}

  deleteActivity(
    activityId: string | undefined,
    date: Date,
    userId: string | undefined,
    paginatorIndex: number | undefined,
    itemsOnPage: number | undefined
  ) {
    const deletionData = { actId: activityId, date: date };
    this.http
      .post('https://iu-time-tracking.click/api/activities/delete', deletionData, {
        withCredentials: true,
      })
      .subscribe(() => {
        this.getAllActivities(userId, paginatorIndex, itemsOnPage);
        this.getAllActivitiesNoQueryParams(userId);
      });
  }

  getAllActivities(
    userId: string | undefined,
    pageIndex: number | undefined,
    itemsOnPage: number | undefined
  ) {
    const queryParams = `?page=${pageIndex}&items=${itemsOnPage}`;
    if (!userId) {
      this.http
        .get<Activity[]>(
          'https://iu-time-tracking.click/api/activities/' + queryParams,
          {
            withCredentials: true,
          }
        )
        .subscribe((response) => {
          this.activitiesSubj.next(response);
        });
      return;
    }
    this.http
      .get<Activity[]>(
        'https://iu-time-tracking.click/api/activities/' + userId + queryParams
      )
      .subscribe((response) => {
        this.activitiesSubj.next(response);
      });
  }

  getAllActivitiesNoQueryParams(userId: string | undefined) {
    if (!userId) {
      this.http
        .get<Activity[]>('https://iu-time-tracking.click/api/activities/', {
          withCredentials: true,
        })
        .subscribe((response) => {
          this.activitiesSubjNoQueryParams.next(response);
        });
      return;
    }
    this.http
      .get<Activity[]>('https://iu-time-tracking.click/api/activities/' + userId)
      .subscribe((response) => {
        this.activitiesSubjNoQueryParams.next(response);
      });
  }

  createActivity(
    activity: Activity,
    userId: string | undefined,
    paginatorIndex: number | undefined,
    itemsOnPage: number | undefined
  ) {
    this.http
      .post<{ message: string }>(
        'https://iu-time-tracking.click/api/activities/',
        activity,
        { withCredentials: true }
      )
      .subscribe(() => {
        this.getAllActivities(userId, paginatorIndex, itemsOnPage);
        this.getAllActivitiesNoQueryParams(userId);
      });
  }
}
