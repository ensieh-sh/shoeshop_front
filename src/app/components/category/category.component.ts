import {Component, OnInit} from '@angular/core';
import {ProductModelServer, ServerResponse} from '../../models/product.model';
import {ProductService} from '../../services/product.service';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {CartService} from '../../services/cart.service';
import {map} from 'rxjs/operators';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {

  // @ts-ignore
  products: ProductModelServer[] = [];
  catname: string;

  constructor(private productService: ProductService,
              private  router: Router,
              private cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.catname;
        })
      )
      .subscribe(catname => {
        this.catname = catname;
        // console.log(catname);
        this.productService.getproductfromcategory(this.catname).subscribe((prods) => {
          // @ts-ignore
          this.products = prods.products;
          console.log(this.products);
        });
      });
  }

  selectproduct(id: number) {
    this.router.navigate(['/product', id]).then();
  }

  addtocart(id: number) {
    this.cartService.addproducttocart(id);
  }

}
