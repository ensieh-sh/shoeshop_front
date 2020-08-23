import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  cartdata: CartModelServer;
  carttotal: number;
  subtotal: number;

  constructor(public cartService: CartService) {
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartdata = data);
    this.cartService.cartTotal$.subscribe(total => this.carttotal = total);

  }

  changequantity(index: number, increase: boolean) {
    this.cartService.updatecartitems(index, increase);
  }

}
