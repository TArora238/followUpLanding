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
  selector: 'app-payment-method',
  templateUrl: './payment-method.component.html',
  styleUrls: ['./payment-method.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class PaymentMethodComponent implements OnInit {
  env: any = environment;
  client_secret: string;
  paymentMethod: any = {
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
  buttonText = '';
  labelText = '';
  showForm = false;
  cards = [];
  constructor(private snackBar: MatSnackBar, public service: ServiceService, public router: Router) {
  }

  ngOnInit() {
    if (!this.accessToken) {
      if (localStorage.getItem('accessToken')) {
        this.accessToken = localStorage.getItem('accessToken');
      } else {
        this.router.navigate(['login']);
      }
    }
    this.getPaymentMethods();
  }

  getPaymentMethods() {
    this.cards = [];
    const params = {
      'access_token': this.accessToken
    }
    this.service.api('post', 'get_payment_methods', params)
      .subscribe((data: any) => {

        console.log(data);
        if (data.is_error) {
          this.snackBar.open(data.err, '', {
            duration: 2000,
          });
        } else {
          this.cards = data.cards;
        }
      }, (err: any) => {
        this.service.loader = false;
        this.snackBar.open(err.error, '', {
          duration: 2000,
        });
      });
  }

  deletePaymentMethod(card) {
    const params = {
      'access_token': this.accessToken,
      'source_id': card.source_id
    }
    this.service.api('post', 'delete_payment_method', params)
      .subscribe((data: any) => {

        console.log(data);
        if (data.is_error) {
          this.snackBar.open(data.err, '', {
            duration: 2000,
          });
        } else {
          this.cards = data.cards;
        }
      }, (err: any) => {
        this.service.loader = false;
        this.snackBar.open(err.error, '', {
          duration: 2000,
        });
      });
  }

  showForms(form) {
    this.showForm = true;
    if (form === 0) {
      this.labelText = 'Add New Payment Method';
      this.createSetupIntent();
    } else if (form === 1) {
      this.labelText = 'Save New Payment Method & Pay';
      this.createPaymentIntent();
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

  createSetupIntent() {
    const params = {
      'access_token': this.accessToken
    }
    this.service.api('post', 'create_setup_intent', params)
      .subscribe((data: any) => {

        console.log(data);
        this.service.loader = false;
        this.client_secret = data.client_secret;
        this.stripeInit(this.client_secret, 'setup');
        if (data.is_error) {
          this.snackBar.open(data.err, '', {
            duration: 2000,
          });
        } else {
          // something
        }
      }, (err: any) => {

        this.service.loader = false;
        this.snackBar.open(err.error, '', {
          duration: 2000,
        });
      });
  }
  createPaymentIntent() {
    const params = {
      'access_token': this.accessToken,
      'amount_in_cents': 100
    }
    this.service.api('post', 'create_payment_intent', params)
      .subscribe((data: any) => {

        console.log(data);
        this.client_secret = data.client_secret;
        this.stripeInit(this.client_secret, 'payment');
        this.service.loader = false;
        if (data.is_error) {
          this.snackBar.open(data.err, '', {
            duration: 2000,
          });
        } else {
          // something
        }
      }, (err: any) => {

        this.service.loader = false;
        this.snackBar.open(err.error, '', {
          duration: 2000,
        });
      });
  }
  stripeInit(secret_key, intent) {
    if (intent === 'setup') {
      this.buttonText = 'Save Card';
    } else {
      this.buttonText = 'Pay & Save';
    }
    const stripe = Stripe(this.service.settings.stripe_key);

    const elements = stripe.elements();
    const cardElement = elements.create('card', {
      iconStyle: 'solid',
      style: {
        base: {
          iconColor: '#8898AA',
          color: 'white',
          lineHeight: '36px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '19px',

          '::placeholder': {
            color: '#8898AA',
          },
        },
        invalid: {
          iconColor: '#e85746',
          color: '#e85746',
        }
      },
      classes: {
        focus: 'is-focused',
        empty: 'is-empty',
      },
    });
    const inputs = document.querySelectorAll('input.field');
    Array.prototype.forEach.call(inputs, function (input) {
      input.addEventListener('focus', function () {
        input.classList.add('is-focused');
      });
      input.addEventListener('blur', function () {
        input.classList.remove('is-focused');
      });
      input.addEventListener('keyup', function () {
        if (input.value.length === 0) {
          input.classList.add('is-empty');
        } else {
          input.classList.remove('is-empty');
        }
      });
    });
    cardElement.on('change', function (event) {
      const successElement = document.querySelector('.success');
      const errorElement = document.querySelector('.error');
      successElement.classList.remove('visible');
      errorElement.classList.remove('visible');

      if (event.token) {
        // Use the token to create a charge or a customer
        // https://stripe.com/docs/payments/charges-api
        successElement.querySelector('.token').textContent = event.token.id;
        successElement.classList.add('visible');
      } else if (event.error) {
        errorElement.textContent = event.error.message;
        errorElement.classList.add('visible');
      }
    });
    cardElement.mount('#card-element');

    const cardholderName = document.getElementById('cardholder-name');
    const cardButton = document.getElementById('card-button');
    const clientSecret = cardButton.dataset.secret;

    cardButton.addEventListener('click', async (ev) => {
      if (intent === 'setup') {
        stripe.confirmCardSetup(
          secret_key,
          {
            payment_method: {
              card: cardElement,
              billing_details: { name: (cardholderName as HTMLInputElement).value }
            }
          }
        ).then(this.setOutcome);
      } else if (intent === 'payment') {
        stripe.confirmCardPayment(secret_key, {
          payment_method: {
            card: cardElement,
            billing_details: { name: (cardholderName as HTMLInputElement).value }
          },
          setup_future_usage: 'off_session'
        }).then(this.setOutcome);
      }
    });
  }
  setOutcome(result) {
    console.log(result);
    const successElement = document.querySelector('.success');
    const errorElement = document.querySelector('.error');
    successElement.classList.remove('visible');
    errorElement.classList.remove('visible');

    if (result.setupIntent && result.setupIntent.status === 'succeeded') {
      successElement.querySelector('.message').textContent = 'Your card has been added successfully';
      successElement.classList.add('visible');
      setTimeout(function () {
        this.router.navigate(['paymentMethodSuccess']);
      }, 10);
    } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
      successElement.querySelector('.message').textContent = 'Your card has been added & payment has been made successfully';
      successElement.classList.add('visible');
      setTimeout(function () {
        this.router.navigate(['paymentSuccess']);
      }, 10);
    } if (result.error) {
      errorElement.textContent = result.error.message;
      errorElement.classList.add('visible');
    }
  }
  paymentMethodAPI(form: any) {
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
        name: form.value.paymentMethodCardName,
        number: form.value.paymentMethodCardNumber.trim(),
        cvc: form.value.paymentMethodCardCVV,
        exp_month: form.value.paymentMethodCardExpiry.slice(0, 2),
        exp_year: form.value.paymentMethodCardExpiry.slice(3, 5),
        address_line1: form.value.paymentMethodBilling,
        address_line2: form.value.paymentMethodBilling2,
        address_city: form.value.paymentMethodCity,
        address_state: form.value.paymentMethodState,
        address_zip: form.value.paymentMethodZip
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
                this.router.navigate(['paymentMethodSuccess']);
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
