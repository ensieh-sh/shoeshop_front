import {Component, OnInit} from '@angular/core';
import {CartService} from '../../services/cart.service';
import {OrderService} from '../../services/order.service';
import {Router} from '@angular/router';
import {NgxSpinnerService} from 'ngx-spinner';
import {CartModelServer} from '../../models/cart.model';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  carttotal: number;
  cartdata: CartModelServer;
  userid;
  model: any = {};


  constructor(private cartService: CartService,
              private orderService: OrderService,
              private router: Router,
              private spinner: NgxSpinnerService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.cartService.cartData$.subscribe(data => this.cartdata = data);
    this.cartService.cartTotal$.subscribe(total => this.carttotal = total);
    this.userService.userdata$.subscribe(data => {
      // @ts-ignore
      this.userid = data.userid;
      console.log(this.userid);
    });


  }

  oncheckout() {
    if (this.carttotal > 0) {
      this.spinner.show();
      this.cartService.checkoutfromcart(this.userid);
    } else {
      return;
    }

  }


}
