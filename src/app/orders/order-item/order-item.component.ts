import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrderItem } from 'src/app/shared/order-item.model';
import { Item } from 'src/app/shared/item.model';
import { ItemService } from 'src/app/shared/item.service';
import { OrderService } from 'src/app/shared/order.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-order-item',
  templateUrl: './order-item.component.html',
  styleUrls: ['./order-item.component.css']
})
export class OrderItemComponent implements OnInit {
orderItemData: OrderItem;
itemList: Item[];
isValid:boolean = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialogRef: MatDialogRef<OrderItemComponent>,
    private itemService: ItemService,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    if(this.data.orderItemIndex == null){
      this.orderItemData = {
        OrderItemID:null,
        OrderID:this.data.OrderID,
        ItemID:0,
        ItemName:'',
        Price:0,
        Quantity:0,
        Total:0
      }
    }
    else{
      this.orderItemData = Object.assign({}, this.orderService.orderItems[this.data.orderItemIndex]);
    }

    this.itemService.getItemList()
    .then(res => this.itemList = res as Item[])
  }

  updatePrice(ctrl){
    if(ctrl.selectedIndex==0){
      this.orderItemData.Price=0;
      this.orderItemData.ItemName = '';
    }
    else{
      this.orderItemData.Price = this.itemList[ctrl.selectedIndex-1].Price;
      this.orderItemData.ItemName = this.itemList[ctrl.selectedIndex-1].ItemName;
    }
    this.updateTotal();
  }

  updateTotal(){
    this.orderItemData.Total = parseFloat((this.orderItemData.Quantity * this.orderItemData.Price).toFixed(2));
  }

  submitOrderItem(form:NgForm){
    if(this.validateOrderItem(form.value)){
      if(this.data.orderItemIndex == null){
        this.orderService.orderItems.push(form.value);
      }
      else{
        this.orderService.orderItems[this.data.orderItemIndex] = form.value;
      }
      this.dialogRef.close();
    } 
  }  

  validateOrderItem(orderItemData: OrderItem){
    this.isValid = true;
    if(orderItemData.ItemID == 0){
      this.isValid = false;
    }
    else if(orderItemData.Quantity == 0){
      this.isValid = false;
    }
    return this.isValid;
  }
}
