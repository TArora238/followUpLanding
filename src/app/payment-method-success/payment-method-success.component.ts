import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';

@Component({
  selector: 'app-payment-method-success',
  templateUrl: './payment-method-success.component.html',
  styleUrls: ['./payment-method-success.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class PaymentMethodSuccessComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit() {

    setTimeout(() => {
      this.service.loader = false;
    }, 10);
    localStorage.removeItem('accessToken');
  }

}
