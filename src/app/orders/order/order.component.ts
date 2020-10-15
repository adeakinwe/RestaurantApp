import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { OrderItemComponent } from '../order-item/order-item.component';
import { CustomerService } from 'src/app/shared/customer.service';
import { Customer } from '../../shared/customer.model'; 
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  customers: Customer[];
  isValid: boolean = true;

  constructor(private orderService: OrderService,
    private dialog: MatDialog,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private router: Router,
    private currentRoute: ActivatedRoute) { }

  ngOnInit() {
    let orderID = this.currentRoute.snapshot.paramMap.get('id');
    if(orderID == null){
      this.resetForm();
    }
    else{
      this.orderService.getOrderByID(parseInt(orderID)).then((res:any) =>{
        this.orderService.formData = res.order;
        this.orderService.orderItems = res.orderDetails;
      })
    }

    this.customerService.getCustomers()
    .then((res)=>{ this.customers = res as Customer[];
    })
  }

  resetForm(form?:NgForm){
    if(form=null)
    form.resetForm();
    this.orderService.formData ={
      OrderID:null,
      OrderNo: Math.floor(100000 + Math.random() * 900000).toString(),
      CustomerID:0,
      PaymentMethod:'',
      GrandTotal:0,
      DeletedOrderItemID: ''
    };
    this.orderService.orderItems = [];
  }

  addEditOrderItem(orderItemIndex,OrderID){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.width = '40%';
    dialogConfig.data ={orderItemIndex, OrderID}
this.dialog.open(OrderItemComponent, dialogConfig).afterClosed().subscribe((res) => {
  this.grandTotal();
})
  }

  deleteOrderItem(orderItemID: number, i:number){
    if(orderItemID != null){
      this.orderService.formData.DeletedOrderItemID += orderItemID + ",";
    }
    this.orderService.orderItems.splice(i,1);
    this.grandTotal();
  }

  grandTotal(){
    this.orderService.formData.GrandTotal = this.orderService.orderItems.reduce((prev, curr) => {
      return prev + curr.Total;
    }, 0);
    this.orderService.formData.GrandTotal = parseFloat(this.orderService.formData.GrandTotal.toFixed(2));
  }

  validateOrder(){
    this.isValid = true;
    if(this.orderService.formData.CustomerID == 0){
      this.isValid = false;
    }
    else if(this.orderService.orderItems.length == 0){
      this.isValid = false;
    }
    return this.isValid;
  }

  submitOrder(form:NgForm){
    if(this.validateOrder()){
      this.orderService.saveUpdateOrder().subscribe((res) => {
        this.resetForm();
        this.toastr.success('Order','Sweet Chef');
        this.router.navigate(['/orders']);
      })
    }
  }
}
