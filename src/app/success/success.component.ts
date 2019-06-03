import { Component, OnInit } from '@angular/core';
import { ServiceService } from 'app/shared/service.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  constructor(private service: ServiceService) { }

  ngOnInit() {
    this.service.loader = false;
    localStorage.removeItem('accessToken');
  }

}
