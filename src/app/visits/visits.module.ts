import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AngularMaterialModule } from '../angular-material.module';

import { VisitCreateComponent } from './visit-create/visit-create.component';
import { VisitListComponent } from './visit-list/visit-list.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    VisitCreateComponent,
    VisitListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})

export class VisitsModule {

}
