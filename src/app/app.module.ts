import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgxNotificationComponent } from 'ngx-notification';

import { AppComponent } from './app.component';
import { SignInComponent } from './dashboard/sign-in/sign-in.component';
import { AppRoutingModule } from './app-routing.module';
import { PageNotFoundComponent } from './dashboard/page-not-found/page-not-found.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserService } from './_services/user.service';
import { LeftPanelComponent } from './dashboard/left-panel/left-panel.component';
import { HeaderComponent } from './dashboard/header/header.component';
import { DataPanelComponent } from './dashboard/data-panel/data-panel.component';
import { HomeComponent } from './dashboard/data-panel/home/home.component';
import { NewComponent } from './dashboard/data-panel/jobs/new/new.component';
import { UnderProgressComponent } from './dashboard/data-panel/jobs/under-progress/under-progress.component';
import { CompletedComponent } from './dashboard/data-panel/jobs/completed/completed.component';
import { DataService } from './_services/data.service';
import { HeaderInterceptor } from './_services/header-interceptor.service';
import { ModalService } from './_services/modal.service';
import { ModalComponent } from './_directives/modal.component';
import { ClickOutsideDirective } from './_directives/click-outside.directive';
import { ProcessComponent } from './dashboard/data-panel/jobs/cashback/process/process.component';
import { ViewComponent } from './dashboard/data-panel/jobs/cashback/view/view.component';
import { SellerVerifyComponent } from './dashboard/data-panel/jobs/cashback/process/seller-verify/seller-verify.component';
import { SkewComponent } from './dashboard/data-panel/jobs/cashback/process/skew/skew.component';
import { RejectedComponent } from './dashboard/data-panel/jobs/rejected/rejected.component';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    PageNotFoundComponent,
    DashboardComponent,
    NgxNotificationComponent,
    LeftPanelComponent,
    HeaderComponent,
    DataPanelComponent,
    HomeComponent,
    NewComponent,
    UnderProgressComponent,
    CompletedComponent,
    ModalComponent,
    ClickOutsideDirective,
    ProcessComponent,
    ViewComponent,
    SellerVerifyComponent,
    SkewComponent,
    RejectedComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [ModalService, UserService, DataService, { provide: HTTP_INTERCEPTORS, useClass: HeaderInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
