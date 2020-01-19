import { Component, OnInit } from '@angular/core';

import {
  trigger,
  transition,
  useAnimation
} from '@angular/animations';
import {
  fadeInUp
} from 'ng-animate';
import {
  FormControl,
  Validators
} from '@angular/forms';
import {
  MatSnackBar
} from '@angular/material';
import {
  ServiceService
} from 'app/shared/service.service';
import { Router, ActivatedRoute } from '@angular/router';
import {
  environment
} from '../../environments/environment';

import countries from 'assets/json/countries.json';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import {
  AuthService,
  FacebookLoginProvider,
  GoogleLoginProvider
} from 'angular-6-social-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})

export class LoginComponent implements OnInit {
  env: any = environment;
  countries: any = countries;
  login: any = {
    email: '',
    password: '',
  }
  mode_of_signup = 0;
  token = '';
  emailPattern: any = /^[a-z0-9A-Z]+[a-zA-Z0-9.+_]+@[a-z0-9A-Z.-]+\.[a-zA-Z]{2,7}$/;
  email = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
  password = new FormControl('', [Validators.required]);
  constructor(
    private snackBar: MatSnackBar,
    public service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: AuthService
  ) { }

  ngOnInit() {
  }
  getEmailMessage() {
    return this.email.hasError('required') ? 'Email is required' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  };
  getPasswordMessage() {
    return this.password.hasError('required') ? 'Password is required' :
      '';
  };
  loginAPI(form?: any) {
    console.log(form);
    if (form && form.valid) {
      console.log(form.value);
      for (const key in form.value) {
        if (!form.value.hasOwnProperty(key)) {
          this.snackBar.open('Fill all the fields', '', {
            duration: 2000,
          });
          return false;
        }
      }
    } else if (form && !form.valid) {
      this.snackBar.open('Fill all the fields', '', {
        duration: 2000,
      });
    }
      const params = {
        'user_email': form.value.loginEmail,
        'user_password': this.mode_of_signup === 0 ? form.value.loginPassword : '',
        'device_id': this.service.deviceId(),
        device_type: this.env.device_type,
        device_token: this.env.device_token,
        app_type: this.env.app_type,
        app_version: this.env.app_version,
        token: this.token
      }
      this.service.api('post', 'email_login', params)
        .subscribe((data: any) => {
          if (data.is_error) {
            this.snackBar.open(data.err, '', {
              duration: 2000,
            });
          } else {
            form.reset();
            form.resetForm();
            this.snackBar.open('Login successfully', '', {
              duration: 2000,
            });
            localStorage.setItem('accessToken', data.access_token);
            localStorage.setItem('userData', data);
            this.service.saveUserData(data);
            this.router.navigate(['paymentMethod']);
          }
        }, (err: any) => {
          console.log(err);
          this.snackBar.open(err.error, '', {
            duration: 2000,
          });
        });
  }
  public socialLogin(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        // this.login.email = userData.email;
        const name = userData.name.split(' ');
        this.login.fName = name[0] || '';
        this.login.lName = name[1] || '';
        if (socialPlatform === 'facebook') {
          this.mode_of_signup = 1;
          this.token = userData.token;
        } else if (socialPlatform === 'google') {
          this.mode_of_signup = 2;
          this.token = userData.token;
        }
        this.socialLoginAPI(userData.email);
      }
    );
  }
  socialLoginAPI(email) {
    const params = {
      'user_email': email,
      'user_password': '',
      'user_first_name': this.login.fName,
      'user_last_name': this.login.lName,
      'device_id': this.service.deviceId(),
      device_type: this.env.device_type,
      device_token: this.env.device_token,
      app_type: this.env.app_type,
      app_version: this.env.app_version,
      mode_of_signup: this.mode_of_signup,
      token: this.token
    }
    this.service.api('post', 'register_user', params)
      .subscribe((data: any) => {
        if (data.is_error) {
          this.snackBar.open(data.err, '', {
            duration: 2000,
          });
        } else {
          this.snackBar.open('Login successfully', '', {
            duration: 2000,
          });
          localStorage.setItem('accessToken', data.access_token);
          localStorage.setItem('userData', data);
          this.service.saveUserData(data);
          this.router.navigate(['paymentMethod']);
        }
      }, (err: any) => {
        console.log(err);
        this.snackBar.open(err.error, '', {
          duration: 2000,
        });
      });
  }
}
