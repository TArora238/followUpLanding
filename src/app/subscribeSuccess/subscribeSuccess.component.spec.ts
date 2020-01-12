import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeSuccessComponent } from './subscribeSuccess.component';

describe('SubscribeSuccessComponent', () => {
  let component: SubscribeSuccessComponent;
  let fixture: ComponentFixture<SubscribeSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
