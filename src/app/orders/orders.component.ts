import { Component, OnInit } from '@angular/core';
import { OrderService } from '../shared/order.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
orders;

  constructor(private orderService: OrderService,
              private router: Router,
              private toastr: ToastrService) { }

  ngOnInit() {
    this.refreshOrderList()
  }
refreshOrderList(){
  this.orderService.getOrders().then((res)=>{this.orders = res});
}

  editOrders(orderID:number){
    this.router.navigate([`/order/edit/${orderID}`])
  }

  deleteOrder(id: number){
    if(confirm('Do you want to delete this order?')){
      this.orderService.deleteOrders(id).then( res => {
        this.refreshOrderList();
        this.toastr.warning('Order deleted Successfully', 'Sweet Chef')
         })  
    }  
  }
}
  