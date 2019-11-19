import {
  NgModule
} from '@angular/core';
import {
  CommonModule,
} from '@angular/common';
import {
  BrowserModule
} from '@angular/platform-browser';
import {
  Routes,
  RouterModule
} from '@angular/router';
import {
  LandingComponent
} from './landing/landing.component';
import {
  PrivacyComponent
} from './privacy/privacy.component';
import { SignupComponent } from './signup/signup.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SuccessComponent } from './success/success.component';

const routes: Routes = [
  // { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'privacy',
    component: PrivacyComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'subscribe',
    component: SubscriptionComponent
  },
  {
    path: 'success',
    component: SuccessComponent
  },
  {
    path: '**',
    component: LandingComponent
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled',
      anchorScrolling: 'enabled',
    })
  ],
  exports: [],
})
export class AppRoutingModule {}
