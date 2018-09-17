import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './dashboard/sign-in/sign-in.component';
import { PageNotFoundComponent } from './dashboard/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './_guards/auth.guard';
import { HomeComponent } from './dashboard/data-panel/home/home.component';
import { NewComponent } from './dashboard/data-panel/jobs/new/new.component';
import { UnderProgressComponent } from './dashboard/data-panel/jobs/under-progress/under-progress.component';
import { CompletedComponent } from './dashboard/data-panel/jobs/completed/completed.component';
import { ProcessComponent } from './dashboard/data-panel/jobs/cashback/process/process.component';
import { RejectedComponent } from './dashboard/data-panel/jobs/rejected/rejected.component';


const appRoutes: Routes = [
    { path: '', component: SignInComponent, pathMatch: 'full' },
    { path: 'login', component: SignInComponent, pathMatch: 'full' },
    {
        path: 'dashboard', component: DashboardComponent, children: [{ path: '', redirectTo: 'home', pathMatch: 'full' },
        { path: 'home', component: HomeComponent },
        { path: 'new', component: NewComponent },
        { path: 'new/process/:id', component: ProcessComponent },
        { path: 'underProgress', component: UnderProgressComponent },
        { path: 'completed', component: CompletedComponent },
        { path: 'rejected', component: RejectedComponent }
        ]
    },
    { path: '**', component: PageNotFoundComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
