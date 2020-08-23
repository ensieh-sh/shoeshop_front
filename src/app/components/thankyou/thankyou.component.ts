import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {OrderService} from '../../services/order.service';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css']
})
export class ThankyouComponent implements OnInit {
  massage: string;
  orderid: number;
  products: productresponse[] = [];
  carttotal: number;

  constructor(private router: Router,
              private orderService: OrderService) {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation.extras.state as {
      massage: string,
      products: productresponse[],
      orderid: number;
      total: number;

    };
    this.massage = state.massage;
    this.products = state.products;
    this.orderid = state.orderid;
    this.carttotal = state.total;

  }

  ngOnInit(): void {
  }

}

interface productresponse {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  quantity: number;
}



