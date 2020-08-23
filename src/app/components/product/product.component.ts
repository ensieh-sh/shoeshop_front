import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CartService} from '../../services/cart.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {map} from 'rxjs/operators';

declare let $: any; // baraye codehaye jq

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit, AfterViewInit {

  id: number;
  product;
  thumbimages: any[] = [];


  // esmi k to template estefade krdim to parantez mizarim
  @ViewChild('quantity') quantityinput;


  constructor(private productService: ProductService,
              private  cartService: CartService,
              private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        map((param: ParamMap) => {
          // @ts-ignore
          return param.params.id;
        })
      )
      .subscribe(prodid => {
        this.id = prodid;
        this.productService.getsingleproduct(this.id).subscribe(prod => {
          this.product = prod;
          if (prod.images !== null) {
            this.thumbimages = prod.images.split(';');
          }
        });
      });
  }

  ngAfterViewInit(): void {
// Product Main img Slick
    $('#product-main-img').slick({
      infinite: true,
      speed: 300,
      dots: false,
      arrows: true,
      fade: true,
      asNavFor: '#product-imgs',
    });

    // Product imgs Slick
    $('#product-imgs').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      arrows: true,
      centerMode: true,
      focusOnSelect: true,
      centerPadding: 0,
      vertical: true,
      asNavFor: '#product-main-img',
      responsive: [{
        breakpoint: 991,
        settings: {
          vertical: false,
          arrows: false,
          dots: true,
        }
      },
      ]
    });

    // Product img zoom
    var zoomMainProduct = document.getElementById('product-main-img');
    if (zoomMainProduct) {
      $('#product-main-img .product-preview').zoom();
    }

  }


  increase() {
    // tslint:disable-next-line:radix
    let value = parseInt(this.quantityinput.nativeElement.value);

    if (this.product.quantity >= 1) {
      value++;

      if (value > this.product.quantity) {
        value = this.product.quantity;
      }
    } else {
      return;
    }

    this.quantityinput.nativeElement.value = value.toString();
  }

  decrease() {
    let value = parseInt(this.quantityinput.nativeElement.value);

    if (this.product.quantity > 0) {
      value--;

      if (value <= 1) {
        value = 1;
      }
    } else {
      return;
    }

    this.quantityinput.nativeElement.value = value.toString();
  }

  addtocart(id: number) {
    this.cartService.addproducttocart(id, this.quantityinput.nativeElement.value);
  }


}
