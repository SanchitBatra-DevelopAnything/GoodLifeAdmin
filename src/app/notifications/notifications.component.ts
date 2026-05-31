import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  isLoading: boolean = false;

  notificationData: any[] = [];
  notificationKeys: any[] = [];

  // APPROVAL POPUP
  showApproveModal = false;

  selectedNotificationIndex: number | null = null;

  machines: any[] = [];

  selectedMachineIds: string[] = [];

  allowPayLater = false;

  constructor(
    private apiService: ApiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.isLoading = true;

    this.apiService.getDistributorRequests().subscribe((allNotis: any) => {

      if (allNotis == null) {

        this.notificationData = [];
        this.notificationKeys = [];
        this.isLoading = false;

        return;
      }

      this.notificationData = Object.values(allNotis);
      this.notificationKeys = Object.keys(allNotis);

      this.isLoading = false;
    });
  }

  loadMachines() {

    this.apiService.getCategories().subscribe((response: any) => {

      if (!response) {
        this.machines = [];
        return;
      }

      this.machines = Object.keys(response).map(key => ({
        id: key,
        name: response[key].categoryName
      }));
    });
  }

  openApproveModal(index: number) {

    this.selectedNotificationIndex = index;

    this.selectedMachineIds = [];

    this.allowPayLater = false;

    this.loadMachines();

    this.showApproveModal = true;
  }

  closeApproveModal() {

    this.showApproveModal = false;

    this.selectedNotificationIndex = null;

    this.selectedMachineIds = [];

    this.allowPayLater = false;
  }

  toggleMachine(machineId: string, event: any) {

    if (event.target.checked) {

      if (!this.selectedMachineIds.includes(machineId)) {
        this.selectedMachineIds.push(machineId);
      }

    } else {

      this.selectedMachineIds =
        this.selectedMachineIds.filter(id => id !== machineId);
    }
  }

  confirmApproval() {

    if (this.selectedNotificationIndex == null) {
      return;
    }

    const index = this.selectedNotificationIndex;

    const distributorData = {
      ...this.notificationData[index],
      machineIds: this.selectedMachineIds,
      allowPayLater: this.allowPayLater
    };

    this.isLoading = true;

    this.apiService
      .deleteNotification(this.notificationKeys[index])
      .subscribe(() => {

        this.apiService
          .makeDistributor(distributorData)
          .subscribe(() => {

            this.closeApproveModal();

            this.loadNotifications();

            this.toastr.success(
              'Request Approved Successfully!',
              'Notification!',
              {
                timeOut: 4000,
                closeButton: true,
                positionClass: 'toast-top-right'
              }
            );
          });
      });
  }

  sendApprovalNotification(deviceToken: string) {
    return this.apiService.sendPushNotification(
      'Your request has been approved.',
      'Please login.',
      deviceToken
    );
  }

  onReject(index: any) {

    this.isLoading = true;

    this.apiService
      .deleteNotification(this.notificationKeys[index])
      .subscribe(() => {

        this.loadNotifications();

        this.toastr.success(
          'Request Rejected Successfully!',
          'Notification!',
          {
            timeOut: 4000,
            closeButton: true,
            positionClass: 'toast-top-right'
          }
        );
      });
  }
}