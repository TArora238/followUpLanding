import { Component, OnInit } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';
import { FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ServiceService } from 'app/shared/service.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})

export class LandingComponent implements OnInit {
  focus: any;
  focus1: any;
  fadeInUp: any;
  contact: any = {
    name: '',
    mobile: '',
    email: '',
    message: ''
  }
  mobileMask: any = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  emailPattern: any = /^[a-z0-9A-Z]+[a-zA-Z0-9.+_]+@[a-z0-9A-Z.-]+\.[a-zA-Z]{2,7}$/;
  namePattern: any = /^[a-zA-Z 0-9]*$/;
  email = new FormControl('', [Validators.required, Validators.pattern(this.namePattern)]);
  name = new FormControl('', [Validators.required, Validators.pattern(this.emailPattern)]);
  mobile = new FormControl('', [Validators.required]);
  message = new FormControl('', [Validators.required]);
  constructor(private snackBar: MatSnackBar, public service: ServiceService) { }

  ngOnInit() {}
  getEmailMessage() {
    return this.email.hasError('required') ? 'Email is required' :
      this.email.hasError('email') ? 'Not a valid email' :
        '';
  };
  getNameMessage() {
    return this.name.hasError('required') ? 'Name is required' :
        '';
  }
  getMobileMessage() {
    return this.mobile.hasError('required') ? 'Mobile Number is required' :
      '';
  }
  getMessage() {
    return this.message.hasError('required') ? 'Message is required' :
      '';
  }
  sendMessage(form: any) {
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
      const params = {
        contact_name: form.value.contactName,
        contact_email: form.value.contactEmail,
        contact_mobile: '+44-' + form.value.contactMobile.replace(/[^0-9]/g, ''),
        message: form.value.contactMessage
      };
      this.service.api('post', 'contact', params)
        .subscribe((data: any) => {
          if (data.is_error) {
            this.snackBar.open(data.err, '', {
              duration: 2000,
            });
          } else {
            form.reset();
            form.resetForm();
            this.snackBar.open('Form submitted successfully', '', {
              duration: 2000,
            });
          }
        }, (err: any) => {
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

}
