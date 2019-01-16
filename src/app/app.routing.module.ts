import { NgModule } from '@angular/core';
import { VisitListComponent } from './visits/visit-list/visit-list.component';
import { VisitCreateComponent } from './visits/visit-create/visit-create.component';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashBoardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'dashboard', component: DashBoardComponent, canActivate: [AuthGuard] },
  { path: 'viewvisit', component: VisitListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: VisitCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:visitId', component: VisitCreateComponent, canActivate: [AuthGuard]},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule'}
];

@NgModule ({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule {

}
