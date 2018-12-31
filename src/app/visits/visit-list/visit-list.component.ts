import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { PageEvent } from '@angular/material';
import { Subscription } from 'rxjs';

import { Visit } from '../visit.model';
import { VisitsService } from '../visits.service';
import { AuthService } from 'src/app/auth/auth.service';

@Component ({
  selector: 'app-visit-list',
  templateUrl: './visit-list.component.html',
  styleUrls : ['./visit-list.component.css']
})


export class VisitListComponent implements OnInit, OnDestroy {
  // visits = [
  //   {title: 'My First Visit', content: 'Filler1'},
  //   {title: 'My Second Visit', content: 'Filler2'},
  //   {title: 'My Third Visit', content: 'Filler3'}
  // ];

 visits: Visit[] = [];
 isLoading = false;
 totalVisits = 0;
 visitsPerPage = 5;
 currentPage = 1;
 pageSizeOptions = [5, 10, 20];
 userIsAuthenticated = false;
 userId: string;
 private visitsSubb: Subscription;
 private authStatusSub: Subscription;

  constructor (public visitsService: VisitsService, private authService: AuthService) {}

  ngOnInit () {
    this.isLoading = true;
    this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.visitsSubb = this.visitsService
    .getVisitUpdateListener()
    .subscribe((visitData: {visits: Visit[], visitCount: number}) => {
      this.isLoading = false;
      this.totalVisits = visitData.visitCount;
      this.visits = visitData.visits;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
    .getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
      this.userId = this.authService.getUserId();
    });

  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.visitsPerPage = pageData.pageSize;
    this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
  }

  onDelete(visitId: string) {
    this.visitsService.deleteVisit(visitId).subscribe(() => {
      this.visitsService.getVisits(this.visitsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy ()  {
    this.visitsSubb.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
