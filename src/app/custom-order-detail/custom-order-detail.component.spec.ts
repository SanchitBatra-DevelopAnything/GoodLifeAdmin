import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomOrderDetailComponent } from './custom-order-detail.component';

describe('CustomOrderDetailComponent', () => {
  let component: CustomOrderDetailComponent;
  let fixture: ComponentFixture<CustomOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomOrderDetailComponent]
    });
    fixture = TestBed.createComponent(CustomOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
