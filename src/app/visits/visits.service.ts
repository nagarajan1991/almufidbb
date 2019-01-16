import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

import { Visit } from './visit.model';

const BACKEND_URL = environment.apiUrl + '/visits/';

@Injectable({providedIn: 'root'})
export class VisitsService {
  private visits: Visit [] = [];
  private visitsUpdated = new Subject<{visits: Visit[], visitCount: number}>();

constructor(private http: HttpClient, private router: Router) {}

  getVisits(visitsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${visitsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, visits: any, maxVisits: number}>(
      BACKEND_URL + queryParams
      )
    .pipe(map((visitData) => {
      return {
        visits: visitData.visits.map(visit => {
        return {
          title: visit.title,
          content: visit.content,
          id: visit._id,
          creator: visit.creator
        };
      }),
      maxVisits: visitData.maxVisits
    };
    }))
    .subscribe((transformedVisitData) => {
      // console.log(transformedVisitData);
      this.visits = transformedVisitData.visits;
      this.visitsUpdated.next({
        visits: [...this.visits],
        visitCount: transformedVisitData.maxVisits
      });
    });
  }

  getVisitUpdateListener()  {
    return this.visitsUpdated.asObservable();
  }

  getVisit(id: string) {
    return this.http.get<{
      _id: string;
      title: string;
      content: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addVisit(title: string, content: string, creator: string) {
    const visit: Visit = {id: null, title: title, content: content, creator: creator};
    this.http
    .post<{message: string, visitId: string}>(BACKEND_URL, visit)
    .subscribe((responseData) => {
      this.router.navigate(['/viewvisit']);
    });
    }

    updateVisit(id: string, title: string, content: string) {
      const visit: Visit = {id: id, title: title, content: content, creator: null};
      this.http.put(BACKEND_URL + id, visit)
      .subscribe(response => {
        this.router.navigate(['/viewvisit']);
      });
    }

    deleteVisit(visitId: string) {
      return this.http.delete(BACKEND_URL + visitId);
    }
}
