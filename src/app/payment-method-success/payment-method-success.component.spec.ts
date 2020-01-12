import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodSuccessComponent } from './payment-method-success.component';

describe('PaymentMethodSuccessComponent', () => {
  let component: PaymentMethodSuccessComponent;
  let fixture: ComponentFixture<PaymentMethodSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentMethodSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentMethodSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
