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

export interface CustomOrder {
  firebaseOrderId: string;
  orderedBy: string;
  orderDate: string;
  orderTime: string;
  area: string;
  orderStatus: string;
  message?: string;
}

@Component({
  selector: 'app-orders-dashboard',
  templateUrl: './spare-part-orders-dashboard.component.html',
  styleUrls: ['./spare-part-orders-dashboard.component.scss']
})
export class SparePartsOrdersDashboardComponent implements OnInit {

  selectedOrderType: 'EXECUTIVE' | 'CUSTOM' = 'EXECUTIVE';

  loading = false;

  // Executive Orders
  pendingOrders: Order[] = [];
  paymentVerificationOrders: Order[] = [];
  paymentVerifiedOrders: Order[] = [];

  // Custom Orders
  customInquiryOrders: CustomOrder[] = [];
  customWaitingOnCustomerOrders: CustomOrder[] = [];
  customPaymentVerificationOrders: CustomOrder[] = [];
  customPaymentRejectedOrders: CustomOrder[] = [];
  customPaymentVerifiedOrders: CustomOrder[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllOrders();
    this.getAllCustomOrders();
  }

  openOrder(order: Order): void {
    this.router.navigate([
      '/orderDetail/sparePart',
      order.orderedBy,
      order.firebaseOrderId
    ]);
  }

  openCustomOrder(order: CustomOrder): void {
    this.router.navigate([
      '/orderDetail/customOrder',
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
      error: (err: any) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  getAllCustomOrders(): void {

    this.apiService.getAllSparePartCustomOrders().subscribe({
      next: (response: any) => {

        const allOrders: CustomOrder[] = [];

        Object.keys(response || {}).forEach((username) => {

          const userOrders = response[username];

          Object.keys(userOrders || {}).forEach((key) => {

            const order = userOrders[key];

            allOrders.push({
              firebaseOrderId: key,
              orderedBy: order.orderedBy,
              orderDate: order.orderDate,
              orderTime: order.orderTime,
              area: order.area,
              orderStatus: order.orderStatus,
              message: order.message
            });
          });
        });

        this.segregateCustomOrders(allOrders);
      },
      error: (err: any) => {
        console.error(err);
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

  segregateCustomOrders(
    orders: CustomOrder[]
  ): void {

    this.customInquiryOrders = [];
    this.customWaitingOnCustomerOrders = [];
    this.customPaymentVerificationOrders = [];
    this.customPaymentRejectedOrders = [];
    this.customPaymentVerifiedOrders = [];

    orders.forEach(order => {

      switch (order.orderStatus) {

        case 'INQUIRY':
          this.customInquiryOrders.push(order);
          break;

        case 'WAITING_ON_CUSTOMER':
          this.customWaitingOnCustomerOrders.push(order);
          break;

        case 'PAYMENT_VERIFICATION':
          this.customPaymentVerificationOrders.push(order);
          break;

        case 'PAYMENT_REJECTED':
          this.customPaymentRejectedOrders.push(order);
          break;

        case 'PAYMENT_VERIFIED':
          this.customPaymentVerifiedOrders.push(order);
          break;
      }
    });
  }
}