import {Component, OnInit} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {Router} from '@angular/router';
import {ProductModelServer, ServerResponse} from '../../models/product.model';
import {CartService} from '../../services/cart.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  products: ProductModelServer[] = [];

  constructor(private productService: ProductService,
              private  router: Router,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.productService.getallproducts().subscribe((prods: ServerResponse) => {
      this.products = prods.products;
    });
  }

  selectproduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  addtocart(id: number) {
    this.cartService.addproducttocart(id);
  }

  getproductfromcategory(catname: string) {
    this.productService.getproductfromcategory(catname).subscribe((prods) => {
      this.products = prods;
    });
  }

}
