import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class PaymentSuccessComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit() {

    setTimeout(() => {
      this.service.loader = false;
    }, 10);
    localStorage.removeItem('accessToken');
  }
}
