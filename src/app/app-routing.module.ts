import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalenderComponent } from './calender/calender.component';
import { DashboardComponent } from './Dashboard/dashboard/dashboard.component';
import { LoginComponent } from './Login/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: '/calender', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'Login', component: LoginComponent },
  { path: 'calender', component: CalenderComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
