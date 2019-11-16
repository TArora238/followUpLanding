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
import { NewLandingComponent } from './new-landing/landing.component';
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
    NewLandingComponent
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
    TextMaskModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
// platformBrowserDynamic().bootstrapModule(AppModule);
