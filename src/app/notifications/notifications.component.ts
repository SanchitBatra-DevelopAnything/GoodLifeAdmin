import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api/api.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  isLoading:boolean = false;
  notificationData:any;
  notificationKeys:any;



  constructor(private apiService:ApiService , private toastr : ToastrService){}

  ngOnInit()
  {
    this.loadNotifications();
  }

  

  loadNotifications()
  {
    this.isLoading = true;
    this.apiService.getDistributorRequests().subscribe((allNotis)=>{
      if(allNotis == null)
      {
        this.notificationData = [];
        this.notificationKeys = [];
        this.isLoading = false;
        return;
      }
      else
      {
        this.notificationData = Object.values(allNotis);
        this.notificationKeys = Object.keys(allNotis);
        this.isLoading = false;
        return;
      }
    });
  }

  onApprove(index: any) {
    this.isLoading = true;
  
    this.apiService.deleteNotification(this.notificationKeys[index]).subscribe(() => {
      this.apiService.makeDistributor(this.notificationData[index]).subscribe(() => {
  
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
      "Your request has been approved.",
      "Please login.",
      deviceToken
    );
  }

  onReject(index:any)
  {
    this.isLoading = true;
    this.apiService.deleteNotification(this.notificationKeys[index]).subscribe((_)=>{
      this.loadNotifications();
      this.toastr.success('Request Rejected Successfully!', 'Notification!' , {
        timeOut : 4000 ,
        closeButton : true , 
        positionClass : 'toast-top-right'
      });
    });
  }

}
