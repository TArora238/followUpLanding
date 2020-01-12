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
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SubscribeSuccessComponent } from './subscribeSuccess/subscribeSuccess.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodSuccessComponent } from './payment-method-success/payment-method-success.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

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
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
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
    path: 'subscribeSuccess',
    component: SubscribeSuccessComponent
  },
  {
    path: 'paymentMethod',
    component: PaymentMethodComponent
  },
  {
    path: 'paymentMethodSuccess',
    component: PaymentMethodSuccessComponent
  },
  {
    path: 'paymentSuccess',
    component: PaymentSuccessComponent
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
