import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { OrderItem } from './order-item.model';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
formData: Order
orderItems: OrderItem[]

  constructor(private http: HttpClient) { }

  saveUpdateOrder(){
    var postOrder = {
      ...this.formData,
      OrderItems: this.orderItems
    };
    return this.http.post(`${environment.apiUrl}/Order`, postOrder)
  }

  getOrders(){
    return this.http.get(`${environment.apiUrl}/Order`).toPromise();
  }

  getOrderByID(id:number):any{
    return this.http.get(environment.apiUrl+'/Order/'+id).toPromise();
  }

  deleteOrders(id: number){
    return this.http.delete(`${environment.apiUrl}/Order/${id}`).toPromise();
  }
}
