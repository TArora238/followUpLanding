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
