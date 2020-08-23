import {Component, OnInit} from '@angular/core';
import {CartModelServer} from '../../models/cart.model';
import {CartService} from '../../services/cart.service';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  cartdata: CartModelServer;
  carttotal: number;
  authstate: boolean;

  constructor(public cartService: CartService,
              public userService: UserService) {
  }

  ngOnInit(): void {
    this.cartService.cartTotal$.subscribe(total => this.carttotal = total);
    this.cartService.cartData$.subscribe(data => this.cartdata = data);
    this.userService.authstate$.subscribe(authstate => this.authstate = authstate);
  }

}
