import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../services/api/api.service';
import { UtilityService } from '../services/utility/utility.service';

@Component({
  selector: 'app-edit-area',
  templateUrl: './edit-area.component.html',
  styleUrls: ['./edit-area.component.scss']
})
export class EditAreaComponent {

  editAreaForm!: FormGroup;

  isLoading: boolean = false;

  areaKey: string = '';
  areaData: any = {};
  fullConfig: any;

  constructor(
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private apiService: ApiService,
    private toastr: ToastrService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.fullConfig = this.config;

    this.areaKey = this.fullConfig["data"]["key"];
    this.areaData = this.fullConfig["data"]["areaData"];

    this.editAreaForm = this.fb.group({
      areaName: [{ value: this.areaData["areaName"], disabled: true }],
      freightPercentage: [this.areaData["freightPercentage"], Validators.required],
      amcPrice: [this.areaData["amcPrice"], Validators.required],
      amcServices: [this.areaData["amcServices"], Validators.required]
    });
  }

  onSubmit(formValue: any) {
    if (this.editAreaForm.valid) {
      this.isLoading = true;

      // include disabled field manually if needed
      formValue["areaName"] = this.areaData["areaName"];

      this.apiService.editArea(this.areaKey, formValue).subscribe({
        next: () => {
          this.isLoading = false;

          this.utilityService.areaEditted?.next(this.areaKey);

          this.toastr.success(
            'Area updated successfully!',
            'Success',
            {
              timeOut: 3000,
              closeButton: true,
              positionClass: 'toast-top-right'
            }
          );

          this.resetForm();
        },
        error: () => {
          this.isLoading = false;
          this.toastr.error('Something went wrong!', 'Error');
        }
      });

    }
  }

  resetForm() {
    this.editAreaForm.reset();
  }
}