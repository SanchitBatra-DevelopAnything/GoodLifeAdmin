import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-spare-part-order-detail',
  templateUrl: './spare-part-order-detail.component.html',
  styleUrls: ['./spare-part-order-detail.component.scss']
})
export class SparePartOrderDetailComponent implements OnInit {

  order: any;

  selectedFile: File | null = null;

  showAddBalancePopup = false;

  balanceAmount = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get('id');

    const orderedBy =
      this.route.snapshot.paramMap.get(
        'orderedBy'
      );

    this.getOrder(
      orderedBy,
      id
    );
  }

  getOrder(
    orderedBy: any,
    firebaseOrderId: any
  ): void {

    this.apiService
      .getSparePartOrder(
        orderedBy,
        firebaseOrderId
      )
      .subscribe({
        next: (response:any) => {

          this.order = {
            firebaseOrderId:
              firebaseOrderId,
            ...response
          };
        }
      });
  }

  openAddBalancePopup(): void {
    this.showAddBalancePopup = true;
  }

  closeAddBalancePopup(): void {
    this.showAddBalancePopup = false;
  }

  verifyPayment(): void {

    this.apiService.updateOrder(
      this.order.orderedBy,
      this.order.firebaseOrderId,
      {
        status: 'PAYMENT_VERIFIED'
      }
    ).subscribe(() => {

      this.order.status =
        'PAYMENT_VERIFIED';
    });
  }

  moveToPending(): void {

    this.apiService.updateOrder(
      this.order.orderedBy,
      this.order.firebaseOrderId,
      {
        status: 'PENDING'
      }
    ).subscribe(() => {

      this.order.status =
        'PENDING';
    });
  }

  dispatchOrder(): void {

    this.apiService
      .moveToCompletedOrders(this.order)
      .subscribe(() => {

        this.apiService
          .deleteActiveSparePartOrder(
            this.order.orderedBy,
            this.order.firebaseOrderId
          )
          .subscribe(() => {

            this.router.navigate(['/']);
          });

      });
  }

  isImage(url: string): boolean {

    return (
      url.includes('.png') ||
      url.includes('.jpg') ||
      url.includes('.jpeg') ||
      url.includes('firebasestorage')
    );
  }
}