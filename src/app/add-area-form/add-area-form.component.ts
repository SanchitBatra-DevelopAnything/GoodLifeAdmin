import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../services/api/api.service';
import { UtilityService } from '../services/utility/utility.service';

@Component({
  selector: 'app-add-area-form',
  templateUrl: './add-area-form.component.html',
  styleUrls: ['./add-area-form.component.scss']
})
export class AddAreaFormComponent implements OnInit{

  ref:DynamicDialogRef | undefined;
  isLoading:boolean = false;
  addAreaForm:any;

  constructor(private apiService:ApiService , private formBuilder:FormBuilder , private toastr:ToastrService , private utilityService:UtilityService,private dialogService:DialogService){}

  ngOnInit()
  {
    this.addAreaForm = this.formBuilder.group({
      areaName: ['', Validators.required],
      freightPercentage: [null, [Validators.required, Validators.min(0)]],
      amcPrice: [null, [Validators.required, Validators.min(0)]],
      amcServices: [null, [Validators.required, Validators.min(0)]],
    });
  }

  onSubmit(formValue : any)  {
    if (this.addAreaForm.valid) {
      this.isLoading = true;
      this.apiService.addDistributorship(this.addAreaForm.value).subscribe((_:any)=>{
        this.utilityService.areaAdded.next("Added");
        this.isLoading = false;
        this.toastr.success('Area Added Successfully , Please close the form!', 'Notification!' , {
          timeOut : 4000 ,
          closeButton : true , 
          positionClass : 'toast-top-right'
        });
        this.addAreaForm.reset();
      });
    }
  }



}
