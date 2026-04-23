import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SidebarModule } from 'primeng/sidebar';
import {MatCardModule} from '@angular/material/card';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { MatNativeDateModule } from '@angular/material/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { RadioButtonModule } from 'primeng/radiobutton';

import { environment } from 'src/environments/environment';



import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HeaderComponent } from './header/header.component';
import { CategoriesListComponent } from './categories-list/categories-list.component';
import { CategoryItemComponent } from './category-item/category-item.component';
import { AddItemComponent } from './add-item/add-item.component';
import { ManageComponent } from './manage/manage.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { OrdersComponent } from './orders/orders.component';
import { ReportingComponent } from './reporting/reporting.component';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemComponent } from './item/item.component';

import { SpeedDialModule } from 'primeng/speeddial';
import { EditItemComponent } from './edit-item/edit-item.component';
import { DistributorAreasComponent } from './manage/distributor-areas/distributor-areas.component';
import { DistributorsListComponent } from './manage/distributors-list/distributors-list.component';
import { PriceListsNDiscountsComponent } from './manage/price-lists-n-discounts/price-lists-n-discounts.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { AddAreaFormComponent } from './add-area-form/add-area-form.component';
import { OldOrdersComponent } from './orders/old-orders/old-orders.component';
import { OldOrderDetailComponent } from './orders/old-order-detail/old-order-detail.component';
import { SignupFormComponent } from './signup-form/signup-form.component';
import { PaymentCollectionMaintenanceComponent } from './payment-collection-maintenance/payment-collection-maintenance.component';
import { AddItemInOrderComponent } from './add-item-in-order/add-item-in-order.component';
import { AddCategoryFormComponent } from './add-category-form/add-category-form.component';


const appRoutes : Routes = [
  {path: '' , component:LoginComponent , pathMatch:"full"},
  {path: 'categories' , component : CategoriesListComponent},
  {path : 'itemsOf/:categoryKey/:categoryName' , component : ItemListComponent },
  {path:'notifications' , component:NotificationsComponent},
  {path : 'dailyReport' , component : OrdersComponent},
  {path : 'manage' , component : ManageComponent},
  {path : 'manage' , component : ManageComponent , children:[
    {path : 'areas', component : DistributorAreasComponent},
    {path : 'distributors', component : DistributorsListComponent},
    {path:'priceListsAndDiscounts',component:PriceListsNDiscountsComponent}
  ] ,},
  {path : 'reporting' , component : ReportingComponent},
  {path : 'processedOrders' , component : OldOrdersComponent},
  {path : 'orderBill/:orderArea/:orderedBy/:orderKey' , component : OrderDetailComponent},
  {path : 'signup' , component : SignupFormComponent},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    CategoriesListComponent,
    CategoryItemComponent,
    AddItemComponent,
    ManageComponent,
    NotificationsComponent,
    OrdersComponent,
    ReportingComponent,
    ItemListComponent,
    ItemComponent,
    EditItemComponent,
    DistributorsListComponent,
    DistributorAreasComponent,
    OrderDetailComponent,
    PriceListsNDiscountsComponent,
    AddAreaFormComponent,
    OldOrdersComponent,
    OldOrderDetailComponent,
    SignupFormComponent,
    PaymentCollectionMaintenanceComponent,
    AddItemInOrderComponent,
    AddCategoryFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SidebarModule,
    SpeedDialModule,
    DialogModule,
    CardModule,
    DropdownModule,
    DynamicDialogModule,
    ToastrModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    MatTableModule , 
    MatPaginatorModule,
    OverlayPanelModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCardModule,
    TableModule,
    RadioButtonModule,
    RouterModule.forRoot(appRoutes,{useHash: true}),
  ],
  providers: [DialogService],
  bootstrap: [AppComponent]
})
export class AppModule { }
