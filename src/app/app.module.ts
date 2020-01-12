import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { HttpClientModule } from '@angular/common/http';
// import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatSelectModule,
  MatProgressSpinnerModule,
  MatAutocompleteModule
} from '@angular/material';
import { PrivacyComponent } from './privacy/privacy.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { NumbersOnlyDirective } from './shared/numbers-only.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { SignupComponent } from './signup/signup.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { SuccessComponent } from './success/success.component';
import {
  SocialLoginModule,
  AuthServiceConfig,
  GoogleLoginProvider,
  FacebookLoginProvider,
} from 'angular-6-social-login';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { SubscribeSuccessComponent } from './subscribeSuccess/subscribeSuccess.component';
import { PaymentMethodComponent } from './payment-method/payment-method.component';
import { PaymentMethodSuccessComponent } from './payment-method-success/payment-method-success.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';

// Configs
export function getAuthServiceConfigs() {
  const config = new AuthServiceConfig(
    [
      {
        id: FacebookLoginProvider.PROVIDER_ID,
        provider: new FacebookLoginProvider('361455994444229')
      },
      {
        id: GoogleLoginProvider.PROVIDER_ID,
        provider: new GoogleLoginProvider('419674060274-quouat5rppjh81a3autgb9gimtvimpl2.apps.googleusercontent.com')
      }
    ]);
  return config;
}

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    NavbarComponent,
    FooterComponent,
    PrivacyComponent,
    NumbersOnlyDirective,
    SignupComponent,
    SubscriptionComponent,
    SuccessComponent,
    RegisterComponent,
    LoginComponent,
    SubscribeSuccessComponent,
    PaymentMethodComponent,
    PaymentMethodSuccessComponent,
    PaymentSuccessComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    HttpClientModule,
    // NgHttpLoaderModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatAutocompleteModule,
    TextMaskModule,
    SocialLoginModule
  ],
  providers: [{
    provide: AuthServiceConfig,
    useFactory: getAuthServiceConfigs
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
