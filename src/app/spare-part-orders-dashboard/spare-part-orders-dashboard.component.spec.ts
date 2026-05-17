import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SparePartOrdersDashboardComponent } from './spare-part-orders-dashboard.component';

describe('SparePartOrdersDashboardComponent', () => {
  let component: SparePartOrdersDashboardComponent;
  let fixture: ComponentFixture<SparePartOrdersDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SparePartOrdersDashboardComponent]
    });
    fixture = TestBed.createComponent(SparePartOrdersDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
