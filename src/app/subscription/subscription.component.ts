import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ServiceService } from 'app/shared/service.service';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';
declare const Stripe: any;
@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class SubscriptionComponent implements OnInit {
  env: any = environment;
  subscribe: any = {
    cardName: '',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    billing1: '',
    billing2: '',
    zip: '',
    state: '',
    city: '',
  }
  accessToken: any = '';
  stripe_token: any = '';
  public cardMask: any = [/\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/, ' ', /\d/, /\d/, /\d/, /\d/];
  public cardExpiryMask: any = [/[0-1]/, /\d/, '/', /[1-4]/, /\d/];
  // public cardDateMask: any = [/[0-3]/, /\d/];
  public cardCVVMask: any = [/\d/, /\d/, /\d/, /\d/];
  namePattern: any = /^[a-zA-Z 0-9]*$/;
  cardName = new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]);
  cardNumber = new FormControl('', [Validators.required]);
  cardExpiry = new FormControl('', [Validators.required]);
  cardCVV = new FormControl('', [Validators.required]);
  billing1 = new FormControl('', [Validators.required]);
  zip = new FormControl('', [Validators.required]);
  state = new FormControl('', [Validators.required]);
  city = new FormControl('', [Validators.required]);


  constructor(private snackBar: MatSnackBar, public service: ServiceService, public router: Router) { }

  ngOnInit() {
    if (!this.accessToken) {
      if (localStorage.getItem('accessToken')) {
        this.accessToken = localStorage.getItem('accessToken');
      } else {
        this.router.navigate(['login']);
      }
    }
  }

  getCardNameMessage() {
    return this.cardName.hasError('required') ? 'Card Holder Name is required' :
      '';
  };
  getCardNumberMessage() {
    return this.cardNumber.hasError('required') ? 'Card Number is required' :
      '';
  };
  getBillingAddressMessage() {
    return this.billing1.hasError('required') ? 'Billing Address is required' :
      '';
  };
  getZipMessage() {
    return this.zip.hasError('required') ? 'Zip Code is required' :
      '';
  };
  getCityMessage() {
    return this.city.hasError('required') ? 'City is required' :
      '';
  };
  getStateMessage() {
    return this.state.hasError('required') ? 'State is required' :
      '';
  };

  subscribeAPI(form: any) {
    console.log(form);
    if (form.valid) {
      console.log(form.value);
      for (const key in form.value) {
        if (!form.value.hasOwnProperty(key)) {
          this.snackBar.open('Fill all the fields', '', {
            duration: 2000,
          });
          return false;
        }
      }
      this.service.loader = true;
      const card = {
        name: form.value.subscribeCardName,
        number: form.value.subscribeCardNumber.trim(),
        cvc: form.value.subscribeCardCVV,
        exp_month: form.value.subscribeCardExpiry.slice(0, 2),
        exp_year: form.value.subscribeCardExpiry.slice(3, 5),
        address_line1: form.value.subscribeBilling,
        address_line2: form.value.subscribeBilling2,
        address_city: form.value.subscribeCity,
        address_state: form.value.subscribeState,
        address_zip: form.value.subscribeZip
      };
      Stripe.card.createToken(card, (status: any, response: any) => {
        console.log(status, response);
        if (response.error) {
          this.snackBar.open(response.error.message, '', {
            duration: 2000,
          });

          this.service.loader = false;
          return false;
        } else {
          this.stripe_token = response.id;
          if (!this.accessToken) {

            this.service.loader = false;
            if (localStorage.getItem('accessToken')) {
              this.accessToken = localStorage.getItem('accessToken');
            } else {
              this.router.navigate(['login']);
            }
          }
          const params = {
            'access_token': this.accessToken,
            'device_id': this.service.deviceId(),
            device_type: this.env.device_type,
            device_token: this.env.device_token,
            app_type: this.env.app_type,
            app_version: this.env.app_version,
            'stripe_token': this.stripe_token,
            'source_id': '0'
          };

          this.service.loader = true;
          this.service.api('post', 'pay_subscription', params)
            .subscribe((data: any) => {

              this.service.loader = false;
              if (data.is_error) {
                this.snackBar.open(data.err, '', {
                  duration: 2000,
                });
              } else {
                form.reset();
                form.resetForm();
                this.service.loader = false;
                this.snackBar.open('Subscribed successfully', '', {
                  duration: 2000,
                });
                this.router.navigate(['subscribeSuccess']);
              }
            }, (err: any) => {

                this.service.loader = false;
              this.snackBar.open(err.error, '', {
                duration: 2000,
              });
            });
        }
      });
    } else {

      this.service.loader = false;
      this.snackBar.open('Fill all the fields', '', {
        duration: 2000,
      });
    }

  }

}
