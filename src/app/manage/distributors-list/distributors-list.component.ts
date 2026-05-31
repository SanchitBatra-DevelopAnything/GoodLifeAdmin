import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-distributors-list',
  templateUrl: './distributors-list.component.html',
  styleUrls: ['./distributors-list.component.scss']
})
export class DistributorsListComponent {

  distributorsData : any[] = [];
  distributorKeys : any[] = [];
  distributorUsefulData : any[] = [];
  isLoading:boolean = false;
  filteredDistributorUsefulData:any[] = [];

  selectedDistributor: any = null;

allMachines: any[] = [];

selectedMachineIds: string[] = [];

allowPayLater: boolean = false;

isEditModalOpen: boolean = false;

  constructor(private apiService : ApiService , private toastr : ToastrService) { }

  ngOnInit(): void {
    this.isLoading = false;
    this.distributorUsefulData = [];
    this.filteredDistributorUsefulData = [];
    this.getDistributors();
  }


  getDistributors()
  {
    this.isLoading = true;
    this.distributorKeys = [];
    this.distributorsData = [];
    this.distributorUsefulData = [];
    this.apiService.getDistributors().subscribe((distributors)=>{
      if(distributors == null)
      {
        this.distributorsData = [];
        this.distributorKeys = [];
        this.distributorUsefulData = [];
        this.isLoading = false;
        return;
      }
      this.distributorsData = Object.values(distributors);
      this.distributorKeys = Object.keys(distributors);
      this.formDistributorsFullData(distributors);
      this.isLoading = false;
    });
  }

  formDistributorsFullData(distributors:any)
  {
    this.distributorUsefulData = [];
    for(let i=0;i<this.distributorKeys.length;i++)
    {
      let obj = {...distributors[this.distributorKeys[i]] , "distributorKey" : this.distributorKeys[i]};
      this.distributorUsefulData.push(obj);
    }
    this.distributorUsefulData.sort((a, b) => (a.area.trim() > b.area.trim()) ? 1 : -1)
    this.filteredDistributorUsefulData = [...this.distributorUsefulData];
  }

  deleteDistributor(distributorKey : any)
  {
    this.isLoading = true;
    this.apiService.deleteDistributor(distributorKey).subscribe((_)=>{
      this.toastr.success('Distributor Deleted Successfully', 'Notification!' , {
        timeOut : 4000 ,
        closeButton : true , 
        positionClass : 'toast-bottom-right'
      });
      this.getDistributors();
    });
  }

  filterDistributors(dataReceivedEvent : any)
  {
    let dataReceived = dataReceivedEvent.target.value;
    if(dataReceived.toString().trim().length == 0)
    {
      this.filteredDistributorUsefulData = [...this.distributorUsefulData];
      return;
    }
    this.filteredDistributorUsefulData = this.distributorUsefulData.filter((distributorObj)=>{
      console.log(distributorObj.distributorId);
      if(distributorObj.area.toString().trim().toLowerCase().includes(dataReceived.toString().trim().toLowerCase()) || distributorObj.distributorName.toString().trim().toLowerCase().includes(dataReceived.toString().trim().toLowerCase()))
      {
        return true;
      }
      return false;
    });
  }

  editDistributor(distributorKey: any) {

    const distributor = this.distributorUsefulData.find(
      d => d.distributorKey === distributorKey
    );
  
    if (!distributor) {
      return;
    }
  
    this.selectedDistributor = distributor;
  
    this.selectedMachineIds = distributor.machineIds
      ? [...distributor.machineIds]
      : [];
  
    this.allowPayLater = distributor.allowPayLater ?? false;
  
    this.apiService.getCategories().subscribe((categories: any) => {
  
      if (!categories) {
        this.allMachines = [];
      } else {
  
        this.allMachines = Object.keys(categories).map(key => ({
          id: key,
          ...categories[key]
        }));
  
      }
  
      this.isEditModalOpen = true;
    });
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

  saveDistributorChanges() {

    if (!this.selectedDistributor) {
      return;
    }
  
    const payload = {
      machineIds: this.selectedMachineIds,
      allowPayLater: this.allowPayLater
    };
  
    this.apiService
      .updateDistributor(
        this.selectedDistributor.distributorKey,
        payload
      )
      .subscribe(() => {
  
        this.toastr.success(
          'Distributor Updated Successfully',
          'Notification!',
          {
            timeOut: 4000,
            closeButton: true,
            positionClass: 'toast-bottom-right'
          }
        );
  
        this.closeEditModal();
  
        this.getDistributors();
  
      });
  
  }

  closeEditModal() {

    this.isEditModalOpen = false;
  
    this.selectedDistributor = null;
  
    this.selectedMachineIds = [];
  
  }

}
