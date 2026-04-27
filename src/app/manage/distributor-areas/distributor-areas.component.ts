import { Component, OnDestroy, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { AddAreaFormComponent } from 'src/app/add-area-form/add-area-form.component';
import { EditAreaComponent } from 'src/app/edit-area/edit-area.component';
import { ApiService } from 'src/app/services/api/api.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-distributor-areas',
  templateUrl: './distributor-areas.component.html',
  styleUrls: ['./distributor-areas.component.scss']
})
export class DistributorAreasComponent implements OnInit,OnDestroy {

  ref:DynamicDialogRef | undefined;
  isLoading:boolean = false;
  areaData:any[] = [];
  areaKeys:any[] = [];

  areaAddedSub:Subscription | undefined;
  areaEdittedSub:Subscription | undefined;

  constructor(private apiService:ApiService , private toastr:ToastrService , private dialogService:DialogService , private utilityService:UtilityService){}

  ngOnInit()
  {
    this.isLoading = true;
    this.getAreas();
    this.areaAddedSub = this.utilityService.areaAdded.subscribe((_)=>{
      this.getAreas();
      this.ref?.close();
    });
    this.areaEdittedSub = this.utilityService.areaEditted.subscribe((_)=>{
      this.getAreas();
      this.ref?.close();
    })
  }

  getAreas()
  {
    this.isLoading = true;
    this.apiService.getDistributorships().subscribe((areas)=>{
      if(areas == null)
      {
        this.areaData = [];
        this.areaKeys = [];
        this.isLoading = false;
        return;
      }
      this.areaData = Object.values(areas);
      this.areaKeys = Object.keys(areas);
      this.isLoading = false;
    });
  }

  deleteArea(index:number)
  {
    this.isLoading = true;
    this.apiService.deleteDistributorship(this.areaKeys[index]).subscribe((_:any)=>{
      this.toastr.success('Area Deleted Successfully', 'Notification!' , {
        timeOut : 4000 ,
        closeButton : true , 
        positionClass : 'toast-bottom-right'
      });
      this.getAreas();
    });
  }

  editArea(area:any , index:number)
  {
    this.ref = this.dialogService.open(EditAreaComponent, {
      header: 'Edit an area',
      maximizable:true,
      height : "800px",
      width:"600px",
      dismissableMask: true,
      data: {
        key: this.areaKeys[index],
        areaData: area
      }
    });
  }

  onAddArea()
  {
    this.ref = this.dialogService.open(AddAreaFormComponent, { 
      header: 'Add an area',
      maximizable:true,
      height : "800px",
      width:"600px",
  });
  }

  ngOnDestroy()
  {
    this.areaAddedSub?.unsubscribe();
    this.areaEdittedSub?.unsubscribe();
  }

}
