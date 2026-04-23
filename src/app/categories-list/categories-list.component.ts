import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { error } from 'console';
import { AddCategoryFormComponent } from '../add-category-form/add-category-form.component';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {

  isLoading : boolean = false;
  categoryList : any[] = [];
  categoryKeys : any[] = [];
  ref:DynamicDialogRef | undefined;


  constructor(private apiService : ApiService , private dialogService : DialogService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories()
  {
    this.isLoading = true;
    this.apiService.getCategories().subscribe((allCategories:any)=>{
      if(allCategories == null)
      {
        this.isLoading =false;
        return;
      }
      this.categoryList = Object.values(allCategories);
      let categoryNames = [];
      for(let i=0;i<this.categoryList.length;i++)
      {
        categoryNames.push({categoryName : this.categoryList[i].categoryName});
      }
      this.categoryKeys = Object.keys(allCategories);

      this.isLoading = false;
    }) , (error:any)=>{
      this.isLoading = false;

    };
  }

  onAddCategory()
  {
       this.ref = this.dialogService.open(AddCategoryFormComponent, { 
          header: 'Onboard a machine.',
          maximizable:true,
          height : "800px",
          width:"600px",
      });
  }

}
