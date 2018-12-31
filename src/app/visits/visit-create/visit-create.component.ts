import { Component, OnInit, OnDestroy } from '@angular/core';

import { NgForm } from '@angular/forms';
import { VisitsService } from '../visits.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { Visit } from '../visit.model';
import { AuthService } from 'src/app/auth/auth.service';


@Component ({
  selector: 'app-visit-create',
  templateUrl: './visit-create.component.html',
  styleUrls : ['./visit-create.component.css']
})
export class VisitCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  visit: Visit;
  isLoading = false;
  private mode = 'create';
  private visitId: string;
  private authStatusSub: Subscription;

  constructor (
    public visitsService: VisitsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('visitId')) {
        this.mode = 'edit';
        this.visitId = paramMap.get('visitId');
        this.isLoading = true;
        this.visitsService.getVisit(this.visitId).subscribe(visitData => {
          this.isLoading = false;
          this.visit = {
            id: visitData._id,
            title: visitData.title,
            content: visitData.content,
            creator: visitData.creator };
        });
      } else {
        this.mode = 'create';
        this.visitId = null;
      }
    });
  }


  onSaveVisit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.visitsService.addVisit(form.value.title, form.value.content, form.value.creator);
    } else {
      this.visitsService.updateVisit(this.visitId, form.value.title, form.value.content);
    }
    form.resetForm();
  }

  ngOnDestroy ()  {
    this.authStatusSub.unsubscribe();
  }
}
