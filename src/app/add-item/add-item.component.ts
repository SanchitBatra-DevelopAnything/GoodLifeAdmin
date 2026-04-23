import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { ApiService } from '../services/api/api.service';
import { UtilityService } from '../services/utility/utility.service';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss'],
})
export class AddItemComponent implements OnInit{

  ref:DynamicDialogRef | undefined;
  categoryKey:string = "";
  fullConfig:any;
  parentCategoryData:any;
  task:AngularFireUploadTask | any;
  isLoading:boolean = false;

  addItemForm: FormGroup = new FormGroup({

  });
  photoPreview: string | undefined;
  selectedImage:any;

  constructor(private config:DynamicDialogConfig , private formBuilder:FormBuilder , private storage:AngularFireStorage , private apiService:ApiService , private toastr:ToastrService){}
  
  ngOnInit()
  {
    this.fullConfig = this.config;
    this.categoryKey = this.fullConfig["data"]["key"];
    this.parentCategoryData = this.fullConfig["data"]["category"];

    this.addItemForm = this.formBuilder.group({
      itemName: ['', Validators.required],
      price:['' , Validators.required],
      details : [''],
      isCustomizable:[false , Validators.required]
    });
  }


  onFileChange(event: any) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.photoPreview = reader.result as string;
      };
      this.selectedImage = event.target.files[0];
    }
    else
    {
      this.selectedImage = null;
    }
  }

  async onSubmit(formValue : any)  {
    if (this.addItemForm.valid) {
      // Process form data here
      this.isLoading = true;
      var filePath = `items/${this.selectedImage.name}_${new Date().getTime()}`;
      var fileRef = this.storage.ref(filePath);
      this.task = this.storage.upload(filePath,this.selectedImage);
      (await this.task).ref.getDownloadURL().then((url:any) => {
          formValue["imgUrl"] = url;
          this.apiService.addItem(formValue , this.categoryKey).subscribe(()=>{
            this.isLoading = false;
            this.toastr.success('Item Added Successfully!', 'Notification!' , {
              timeOut : 4000 ,
              closeButton : true , 
              positionClass : 'toast-top-right'
            });
            this.resetForm();
          });
       });
    } else {
      // Display validation errors or take appropriate action
    }
  }

  resetForm()
  {
    this.addItemForm.reset();
    this.photoPreview = undefined;
    this.selectedImage = null;
  }
}

