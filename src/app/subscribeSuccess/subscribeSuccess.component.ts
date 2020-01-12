import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service.service';
import { trigger, transition, useAnimation } from '@angular/animations';
import { fadeInUp } from 'ng-animate';
@Component({
  selector: 'app-subscribe-success',
  templateUrl: './subscribeSuccess.component.html',
  styleUrls: ['./subscribeSuccess.component.scss'],
  animations: [
    trigger('fadeInUp', [transition('* => *', useAnimation(fadeInUp))])
  ],
})
export class SubscribeSuccessComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit() {

    setTimeout(() => {
      this.service.loader = false;
    }, 10);
    localStorage.removeItem('accessToken');
  }

}
