import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../services/api/api.service';

export interface Order {
  firebaseOrderId: string;
  orderId: string;
  orderedBy: string;
  orderDate: string;
  orderTime: string;
  status: string;
  totalPrice: number;
  area: string;
  partyClaimedPaymentComplete: boolean;
}

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './spare-part-orders-dashboard.component.html',
  styleUrls: ['./spare-part-orders-dashboard.component.scss']
})
export class SparePartsOrdersDashboardComponent implements OnInit {

  pendingOrders: Order[] = [];

  paymentVerificationOrders: Order[] = [];

  paymentVerifiedOrders: Order[] = [];

  loading = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
  }

  openOrder(order: any): void {

    this.router.navigate([
      '/orderDetail/sparePart',
      order.orderedBy,
      order.firebaseOrderId
    ]);
  }

  getAllOrders(): void {

    this.loading = true;

    this.apiService.getAllSparePartOrders().subscribe({
      next: (response: any) => {

        const allOrders: Order[] = [];

        Object.keys(response || {}).forEach((username) => {

          const userOrders = response[username];

          Object.keys(userOrders || {}).forEach((key) => {

            const order = userOrders[key];

            allOrders.push({
              firebaseOrderId: key,
              orderId: order.orderId,
              orderedBy: order.orderedBy,
              orderDate: order.orderDate,
              orderTime: order.orderTime,
              status: order.status,
              totalPrice: order.totalPrice,
              area: order.area,
              partyClaimedPaymentComplete:
                order.partyClaimedPaymentComplete
            });
          });
        });

        this.segregateOrders(allOrders);

        this.loading = false;
      },
      error: (err:any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  segregateOrders(orders: Order[]): void {

    this.pendingOrders = [];

    this.paymentVerificationOrders = [];

    this.paymentVerifiedOrders = [];

    orders.forEach(order => {

      switch (order.status) {

        case 'PENDING':
          this.pendingOrders.push(order);
          break;

        case 'PAYMENT_VERIFICATION':
          this.paymentVerificationOrders.push(order);
          break;

        case 'PAYMENT_VERIFIED':
          this.paymentVerifiedOrders.push(order);
          break;
      }
    });
  }
}