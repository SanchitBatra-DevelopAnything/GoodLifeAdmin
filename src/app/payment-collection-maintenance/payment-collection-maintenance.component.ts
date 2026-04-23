import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { UtilityService } from '../services/utility/utility.service';

@Component({
  selector: 'app-payment-collection-maintenance',
  templateUrl: './payment-collection-maintenance.component.html',
  styleUrls: ['./payment-collection-maintenance.component.scss']
})
export class PaymentCollectionMaintenanceComponent implements OnInit {

    @Input()
    showButton!:boolean;

    isCurrentMonthJuly : boolean = new Date().getMonth()+1==7;


    constructor(private apiService:ApiService , private utilityService:UtilityService){}

    ngOnInit()
    {
      
    }

    getSrc()
    {
      if(this.isCurrentMonthJuly)
      {
        return "../../assets/julyQR-kidys.jpeg"
      }
      else
      {
        return "../../assets/backup.jpeg"
      }
    }

    skipMaintenance()
    {
      this.utilityService.skippedMaintenance.next(true);
    }
}
