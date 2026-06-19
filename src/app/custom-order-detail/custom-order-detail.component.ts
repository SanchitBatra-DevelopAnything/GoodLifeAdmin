import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ApiService } from '../services/api/api.service';

import {
  AngularFireStorage,
  AngularFireUploadTask
} from '@angular/fire/compat/storage';

@Component({
  selector: 'app-custom-order-detail',
  templateUrl:
    './custom-order-detail.component.html',
  styleUrls: [
    './custom-order-detail.component.scss'
  ]
})
export class CustomOrderDetailComponent
  implements OnInit {

  order: any;

  selectedPIFile: File | null = null;

  selectedAdditionalFile:
    File | null = null;

  uploadTask:
    AngularFireUploadTask | any;

  isUploadingPI = false;

  isUploadingAdditional = false;

  isLoading = false;

loadingMessage = 'Please wait...';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private storage: AngularFireStorage
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

  private startLoading(
    message: string
  ): void {
  
    this.loadingMessage =
      message;
  
    this.isLoading = true;
  }
  
  private stopLoading(): void {
  
    this.isLoading = false;
  }

  getOrder(
    orderedBy: any,
    firebaseOrderId: any
  ): void {
  
    this.startLoading(
      'Loading order...'
    );
  
    this.apiService
      .getInquiryOrder(
        orderedBy,
        firebaseOrderId
      )
      .subscribe({
        next: (response: any) => {
  
          this.order = {
            firebaseOrderId,
            ...response
          };
  
          this.stopLoading();
        },
        error: () => {
  
          this.stopLoading();
        }
      });
  }

  deleteOrder(): void {

    this.startLoading(
      'Deleting order...'
    );
  
    this.apiService
      .deleteInquiryOrder(
        this.order.orderedBy,
        this.order.firebaseOrderId
      )
      .subscribe(() => {
  
        this.stopLoading();
  
        this.router.navigate([
          '/dailyReport'
        ]);
  
      });
  }

  verifyPayment(): void {

    this.startLoading(
      'Verifying payment...'
    );
  
    this.apiService
      .updateInquiryOrder(
        this.order.orderedBy,
        this.order.firebaseOrderId,
        {
          orderStatus:
            'PAYMENT_VERIFIED'
        }
      )
      .subscribe(() => {
  
        this.order.orderStatus =
          'PAYMENT_VERIFIED';
  
        this.stopLoading();
      });
  }

  rejectPayment(): void {

    this.startLoading(
      'Rejecting payment...'
    );
  
    this.apiService
      .updateInquiryOrder(
        this.order.orderedBy,
        this.order.firebaseOrderId,
        {
          orderStatus:
            'PAYMENT_REJECTED'
        }
      )
      .subscribe(() => {
  
        this.order.orderStatus =
          'PAYMENT_REJECTED';
  
        this.stopLoading();
      });
  }

  async dispatchOrder(): Promise<void> {

    this.startLoading(
      'Dispatching order...'
    );
  
    try {
  
      const updatedOrder = {
        ...this.order,
        orderStatus: 'DISPATCHED',
        dispatchedOn:
          new Date()
            .toISOString()
            .split('T')[0]
      };
  
      this.apiService
        .moveInquiryOrderToCompleted(
          updatedOrder
        )
        .subscribe({
  
          next: () => {
  
            this.apiService
              .deleteInquiryOrder(
                this.order.orderedBy,
                this.order.firebaseOrderId
              )
              .subscribe({
  
                next: () => {
  
                  this.stopLoading();
  
                  this.router.navigate([
                    '/dailyReport'
                  ]);
  
                },
  
                error: (error) => {
  
                  console.error(
                    error
                  );
  
                  this.stopLoading();
  
                  alert(
                    'Failed to delete inquiry order.'
                  );
                }
  
              });
  
          },
  
          error: (error) => {
  
            console.error(
              error
            );
  
            this.stopLoading();
  
            alert(
              'Failed to move order to completed orders.'
            );
          }
  
        });
  
    } catch (error) {
  
      console.error(error);
  
      this.stopLoading();
  
      alert(
        'Something went wrong while dispatching order.'
      );
    }
  }

  onPISelected(
    event: any
  ): void {

    if (
      event.target.files &&
      event.target.files.length
    ) {

      this.selectedPIFile =
        event.target.files[0];

    }
  }

  onAdditionalSelected(
    event: any
  ): void {

    if (
      event.target.files &&
      event.target.files.length
    ) {

      this.selectedAdditionalFile =
        event.target.files[0];

    }
  }

  async uploadPI(): Promise<void> {

    if (!this.selectedPIFile) {
      return;
    }
  
    this.startLoading(
      'Uploading PI...'
    );
  
    try {
  
      const currentDate =
        new Date()
          .toISOString()
          .split('T')[0];
  
      const filePath =
        `customOrderPI/${currentDate}/${Date.now()}_${this.selectedPIFile.name}`;
  
      const uploadTask =
        this.storage.upload(
          filePath,
          this.selectedPIFile
        );
  
      const uploadResult =
        await uploadTask;
  
      const downloadUrl =
        await uploadResult.ref.getDownloadURL();
  
      this.apiService
        .updateInquiryOrder(
          this.order.orderedBy,
          this.order.firebaseOrderId,
          {
            piLink: downloadUrl,
            orderStatus:
              'WAITING_ON_CUSTOMER'
          }
        )
        .subscribe({
  
          next: () => {
  
            this.order.piLink =
              downloadUrl;
  
            this.order.orderStatus =
              'WAITING_ON_CUSTOMER';
  
            this.selectedPIFile =
              null;
  
            this.stopLoading();
  
            alert(
              'PI uploaded successfully.'
            );
          },
  
          error: (error) => {
  
            console.error(
              error
            );
  
            this.stopLoading();
  
            alert(
              'Failed to update order.'
            );
          }
  
        });
  
    } catch (error) {
  
      console.error(
        'PI Upload Failed',
        error
      );
  
      this.stopLoading();
  
      alert(
        'Failed to upload PI.'
      );
    }
  }

  async uploadAdditionalDocument(): Promise<void> {

    if (!this.selectedAdditionalFile) {
      return;
    }
  
    const file = this.selectedAdditionalFile;
  
    const isPdf =
      file.type === 'application/pdf';
  
    const isImage =
      file.type.startsWith('image/');
  
    if (!isPdf && !isImage) {
      alert(
        'Only PDF and image files are allowed.'
      );
      return;
    }
  
    this.startLoading(
      'Uploading document...'
    );
  
    try {
  
      const currentDate =
        new Date()
          .toISOString()
          .split('T')[0];
  
      const filePath =
        `customOrderDocuments/${currentDate}/${Date.now()}_${file.name}`;
  
      const uploadTask =
        this.storage.upload(
          filePath,
          file
        );
  
      const uploadResult =
        await uploadTask;
  
      const downloadUrl =
        await uploadResult.ref.getDownloadURL();
  
      const documentType:
        'pdf' | 'image' =
        isPdf
          ? 'pdf'
          : 'image';
  
      const existingDocuments =
        this.order.additionalDocuments || [];
  
      const updatedDocuments = [
        ...existingDocuments,
        {
          url: downloadUrl,
          type: documentType
        }
      ];
  
      this.apiService
        .updateInquiryOrder(
          this.order.orderedBy,
          this.order.firebaseOrderId,
          {
            additionalDocuments:
              updatedDocuments
          }
        )
        .subscribe({
  
          next: () => {
  
            this.order.additionalDocuments =
              updatedDocuments;
  
            this.selectedAdditionalFile =
              null;
  
            this.stopLoading();
  
            alert(
              'Document uploaded successfully.'
            );
          },
  
          error: (error) => {
  
            console.error(
              error
            );
  
            this.stopLoading();
  
            alert(
              'Failed to update order.'
            );
          }
  
        });
  
    } catch (error) {
  
      console.error(
        'Upload failed',
        error
      );
  
      this.stopLoading();
  
      alert(
        'Failed to upload document.'
      );
    }
  }

  isImage(
    url: string
  ): boolean {

    const lower =
      url.toLowerCase();

    return (
      lower.includes('.png') ||
      lower.includes('.jpg') ||
      lower.includes('.jpeg') ||
      lower.includes('.webp')
    );
  }
}