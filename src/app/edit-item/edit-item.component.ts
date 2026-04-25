import { Component } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ApiService } from '../services/api/api.service';
import { UtilityService } from '../services/utility/utility.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent {

  ref:DynamicDialogRef | undefined;
  itemKey:string = "";
  fullConfig:any;
  itemData:any = {};
  categoryKey:string = "";
  task:AngularFireUploadTask | any;
  isLoading:boolean = false;

  originalUrl:string|undefined;

  editItemForm: FormGroup = new FormGroup({

  });
  photoPreview: string | undefined;
  selectedImage:any;

  constructor(private config:DynamicDialogConfig , private formBuilder:FormBuilder , private storage:AngularFireStorage , private apiService:ApiService , private toastr:ToastrService , private utilityService:UtilityService){}
  
  ngOnInit()
  {
    this.fullConfig = this.config;
    this.itemKey = this.fullConfig["data"]["key"];
    this.itemData = this.fullConfig["data"]["itemData"];
    this.categoryKey = this.fullConfig["data"]["categoryKey"];

    // console.log("RECEIVED ITEM DATA = "+JSON.stringify(this.fullConfig["data"]["itemData"]));


    this.editItemForm = this.formBuilder.group({
      itemName: [this.itemData["itemName"], Validators.required],
      price: [this.itemData["price"], Validators.required],
      isCustomizable : [this.itemData["isCustomizable"] , Validators.required],
      details : [this.itemData['details']],
    });

    this.photoPreview = this.itemData["imgUrl"];
    this.originalUrl = this.photoPreview; //set original url as the url originally , photoPreview will change if new image is selected.
  }


  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.photoPreview = reader.result as string; //image changed , original url != photoPreview now.
      };
      this.selectedImage = event.target.files[0];
    }
    else
    {
      this.selectedImage = null;
    }
  }

  async onSubmit(formValue : any)  {
    if (this.editItemForm.valid) {
      // Process form data here
      this.isLoading = true;
      if(this.originalUrl!=this.photoPreview)
      {
      var filePath = `items/${this.selectedImage.name}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);
        this.task = this.storage.upload(filePath,this.selectedImage);
        (await this.task).ref.getDownloadURL().then((url:any) => {
            formValue["imgUrl"] = url;
            this.apiService.editItem(this.categoryKey , this.itemKey , formValue).subscribe(()=>{
              this.utilityService.itemEditted.next(this.itemKey);
              this.isLoading = false;
              this.toastr.success('Item Editted Successfully , Please close the form!', 'Notification!' , {
                timeOut : 4000 ,
                closeButton : true , 
                positionClass : 'toast-top-right'
              });
              this.resetForm();
            });
         });
      }
      else
      {
        //photo was same , only update the items content.
        formValue["imgUrl"] = this.originalUrl;
        this.apiService.editItem(this.categoryKey , this.itemKey , formValue).subscribe((_)=>{
          this.utilityService.itemEditted.next(this.itemKey);
          this.isLoading = false;
          this.toastr.success('Item Editted Successfully , Please close the form!', 'Notification!' , {
            timeOut : 4000 ,
            closeButton : true , 
            positionClass : 'toast-top-right'
          });
          this.resetForm();
        });
      }
    } else {
      // Display validation errors or take appropriate action
    }
  }

  resetForm()
  {
    this.editItemForm.reset();
    this.photoPreview = undefined;
    this.originalUrl = this.photoPreview;
    this.selectedImage = null;
  }

}
