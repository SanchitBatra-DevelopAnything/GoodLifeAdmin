import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartOrderDetailComponent } from './spare-part-order-detail.component';

describe('SparePartOrderDetailComponent', () => {
  let component: SparePartOrderDetailComponent;
  let fixture: ComponentFixture<SparePartOrderDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SparePartOrderDetailComponent]
    });
    fixture = TestBed.createComponent(SparePartOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
