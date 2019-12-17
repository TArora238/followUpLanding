import {
  Component,
  OnInit
} from '@angular/core';
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
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class SignupComponent implements OnInit {
  env: any = environment;
  countries: any = countries;
  signup: any = {
    fName: '',
    lName: '',
    mobile: '',
    email: '',
    password: '',
    cPassword: '',
    code: ''
  }
  mobileMask: any = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  emailPattern: any = /^[a-z0-9A-Z]+[a-zA-Z0-9.+_]+@[a-z0-9A-Z.-]+\.[a-zA-Z]{2,7}$/;
  namePattern: any = /^[a-zA-Z 0-9]*$/;
  email = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
  fName = new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]);
  lName = new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]);
  mobile = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  referral_code = '';
  filteredCountries: Observable<any[]>;
  myControl = new FormControl();
  mode_of_signup = 0;
  token = '';
  constructor(
    private snackBar: MatSnackBar,
    public service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
    private socialAuthService: AuthService
    ) {}

  ngOnInit() {
    console.log(this.route.queryParams);
    this.route.queryParams
      .filter(params => params.ref)
      .subscribe(params => {
        console.log(params); // {order: "popular"}

        this.referral_code = params.ref;
        console.log(this.referral_code); // popular
      });
    this.filteredCountries = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.countries.filter(option => option.dial_code.includes(filterValue));
  }

  getCode(code) {
    console.log(code);
    this.signup.code = code;
  }
  getEmailMessage() {
    return this.email.hasError('required') ? 'Email is required' :
      this.email.hasError('email') ? 'Not a valid email' :
      '';
  };
  getFNameMessage() {
    return this.fName.hasError('required') ? 'First Name is required' :
      '';
  };
  getLNameMessage() {
    return this.lName.hasError('required') ? 'Last Name is required' :
      '';
  };
  getMobileMessage() {
    return this.mobile.hasError('required') ? 'Mobile Number is required' :
      '';
  };
  getPasswordMessage() {
    return this.mobile.hasError('required') ? 'Password is required' :
      '';
  };
  signUpAPI(form: any) {
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
      if (!this.signup.code && this.mode_of_signup === 0) {
        this.snackBar.open('Fill all the fields', '', {
          duration: 2000,
        });
        return false;
      }
      if (form.value.signupPassword !== form.value.signupCPassword) {
        this.snackBar.open('Passwords don\'t match', '', {
          duration: 2000,
        });
        return false;
      }
      const params = {
        'user_email': form.value.signupEmail,
        'user_first_name': form.value.signupFName,
        'user_last_name': form.value.signupLName,
        'user_password': this.mode_of_signup > 0 ? form.value.signupPassword : '',
        'user_mobile': this.signup.code + '-' + form.value.signupMobile.replace(/[^0-9]/g, ''),
        'referral_code': this.referral_code ? this.referral_code : '',
        'hear_from_us': '1',
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
            form.reset();
            form.resetForm();
            this.snackBar.open('Registered successfully', '', {
              duration: 2000,
            });
            localStorage.setItem('accessToken', data.access_token);
            this.service.saveUserData(data);
            this.router.navigate(['success']);
          }
        }, (err: any) => {
          console.log(err);
          this.snackBar.open(err.error, '', {
            duration: 2000,
          });
        });
    } else {
      this.snackBar.open('Fill all the fields', '', {
        duration: 2000,
      });
    }

  }
  public socialSignUp(socialPlatform: string) {
    let socialPlatformProvider;
    if (socialPlatform === 'facebook') {
      socialPlatformProvider = FacebookLoginProvider.PROVIDER_ID;
    } else if (socialPlatform === 'google') {
      socialPlatformProvider = GoogleLoginProvider.PROVIDER_ID;
    }

    this.socialAuthService.signIn(socialPlatformProvider).then(
      (userData) => {
        console.log(socialPlatform + ' sign in data : ', userData);
        this.signup.email = userData.email;
        const name = userData.name.split(' ');
        this.signup.fName = name[0] || '';
        this.signup.lName = name[1] || '';
        if (socialPlatform === 'facebook') {
          this.mode_of_signup = 1;
          this.token = userData.token;
        } else if (socialPlatform === 'google') {
          this.mode_of_signup = 2;
          this.token = userData.token;
        }
      }
    );
  }
}
