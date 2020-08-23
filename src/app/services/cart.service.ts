import {Injectable} from '@angular/core';
import {NavigationExtras, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ProductService} from './product.service';
import {OrderService} from './order.service';
import {environment} from '../../environments/environment';
import {CartModelpublic, CartModelServer} from '../models/cart.model';
import {BehaviorSubject} from 'rxjs';
import {isNgContainer} from '@angular/compiler';
import {ProductModelServer} from '../models/product.model';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';


@Injectable({
  providedIn: 'root'
})
export class CartService {
  private SERVER_URL = environment.SERVER_URL;

  // variable for save cart data on client's local storage
  private cartdataclient: CartModelpublic = {
    total: 0,
    prodData: [
      {
        incart: 0,
        id: 0,
      }
    ]
  };

  // variable for sava cart info on front
  private cartdataServer: CartModelServer = {
    total: 0,
    data: [
      {
        numincart: 0,
        product: undefined
      }
    ]
  };

  // observable for components to subscribe
  cartTotal$ = new BehaviorSubject<number>(0);
  cartData$ = new BehaviorSubject<CartModelServer>(this.cartdataServer);


  constructor(private http: HttpClient,
              private productService: ProductService,
              private orderService: OrderService,
              private router: Router,
              private toast: ToastrService,
              private spinner: NgxSpinnerService) {
    this.cartTotal$.next(this.cartdataServer.total);
    this.cartData$.next(this.cartdataServer);

    // get info from local storage if any
    const info: CartModelpublic = JSON.parse(localStorage.getItem('cart'));
    // check if info is null or hava data
    if (info !== null && info !== undefined && info.prodData[0].incart !== 0) {
      // local storage have info
      this.cartdataclient = info;

      //  loop through each entry and put in cartdataserver object
      this.cartdataclient.prodData.forEach(p => {
        this.productService.getsingleproduct(p.id).subscribe((actualproductinfo: ProductModelServer) => {
          if (this.cartdataServer.data[0].numincart === 0) {
            this.cartdataServer.data[0].numincart = p.incart;
            this.cartdataServer.data[0].product = actualproductinfo;
            this.caculatetotal();
            this.cartdataclient.total = this.cartdataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
          } else {
            // cartdataserver already  has entry in it
            this.cartdataServer.data.push({
              numincart: p.incart,
              product: actualproductinfo
            });
            this.caculatetotal();
            this.cartdataclient.total = this.cartdataServer.total;
            localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
          }
          // ... create copy of cart data server
          this.cartData$.next({...this.cartdataServer});
        });
      });


    }


  }

  addproducttocart(id: number, quantity?: number) {
    this.productService.getsingleproduct(id).subscribe(prod => {
      //  if cart is empty
      if (this.cartdataServer.data[0].product === undefined) {
        this.cartdataServer.data[0].product = prod;
        this.cartdataServer.data[0].numincart = quantity !== undefined ? quantity : 1;
        this.caculatetotal();
        this.cartdataclient.prodData[0].incart = this.cartdataServer.data[0].numincart;
        this.cartdataclient.prodData[0].id = prod.id;
        this.cartdataclient.total = this.cartdataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
        this.cartData$.next({...this.cartdataServer});

        this.toast.success(`${prod.name} added to the cart`, 'Product Added', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
      //  if cart has some item
      else {
        // tslint:disable-next-line:max-line-length
        const index = this.cartdataServer.data.findIndex(p => p.product.id === prod.id); // age item az ghabl base index idisho mide age nabashe -1 mide
        // a:item to cart bashe az ghabl
        if (index !== -1) {
          if (quantity !== undefined && quantity <= prod.quantity) {
            // tslint:disable-next-line:max-line-length
            this.cartdataServer.data[index].numincart = this.cartdataServer.data[index].numincart < prod.quantity ? quantity : prod.quantity;
          } else {
            // tslint:disable-next-line:no-unused-expression
            this.cartdataServer.data[index].numincart < prod.quantity ? this.cartdataServer.data[index].numincart++ : prod.quantity;
          }
          this.cartdataclient.prodData[index].incart = this.cartdataServer.data[index].numincart;
          this.caculatetotal();
          this.cartdataclient.total = this.cartdataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
          this.toast.info(`${prod.name} quantity updated in the cart`, 'Product Updated', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });

        }
        //  b: item to cart nabashe
        else {
          this.cartdataServer.data.push({
            numincart: 1,
            product: prod
          });
          this.cartdataclient.prodData.push({
            incart: 1,
            id: prod.id
          });
          localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
          this.toast.success(`${prod.name} added to thr cart`, 'Product Added', {
            timeOut: 1500,
            progressBar: true,
            progressAnimation: 'increasing',
            positionClass: 'toast-top-right'
          });
          this.caculatetotal();
          this.cartdataclient.total = this.cartdataServer.total;
          localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
          this.cartData$.next({...this.cartdataServer});
        }
      }
    });
  }

  updatecartitems(index: number, increase: boolean) {
    const data = this.cartdataServer.data[index];

    if (increase) {
      data.numincart < data.product.quantity ? data.numincart++ : data.product.quantity;
      this.cartdataclient.prodData[index].incart = data.numincart;
      this.caculatetotal();
      this.cartdataclient.total = this.cartdataServer.total;
      localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
      this.cartData$.next({...this.cartdataServer});
    }  //  kam beshe
    else {
      data.numincart--;
      if (data.numincart < 1) {
        this.deleteproductfromcart(index);
        this.cartData$.next({...this.cartdataServer});
      } else {
        this.cartData$.next({...this.cartdataServer});
        this.cartdataclient.prodData[index].incart = data.numincart;
        this.caculatetotal();
        this.cartdataclient.total = this.cartdataServer.total;
        localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
      }
    }
  }

  deleteproductfromcart(index: number) {
    if (window.confirm('are you sure you want to remove item?')) {
      this.cartdataServer.data.splice(index, 1);
      this.cartdataclient.prodData.splice(index, 1);
      this.caculatetotal();
      this.cartdataclient.total = this.cartdataServer.total;
      if (this.cartdataclient.total === 0) {
        this.cartdataclient = {total: 0, prodData: [{incart: 0, id: 0}]};
        localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
      } else {
        localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
      }
      if (this.cartdataServer.total === 0) {
        this.cartdataServer = {total: 0, data: [{numincart: 0, product: undefined}]};
        this.cartData$.next({...this.cartdataServer});
      } else {
        this.cartData$.next({...this.cartdataServer});
      }
    }
     // user cancel kone delete krdno
    else {
      return;
    }
  }

  private caculatetotal() {
    let total = 0;
    this.cartdataServer.data.forEach(p => {
      const {numincart} = p;
      const {price} = p.product;
      total += numincart * price;
    });
    this.cartdataServer.total = total;
    this.cartTotal$.next(this.cartdataServer.total);
  }

  checkoutfromcart(userid: number) {
    this.http.post(`${this.SERVER_URL}/orders/payment`, null).subscribe((res: { success: boolean }) => {
      if (res.success) {
        this.resetserverdata();
        this.http.post(`${this.SERVER_URL}/orders/new`, {
          userid,
          products: this.cartdataclient.prodData
        }).subscribe((data: orderdresponse) => {
          this.orderService.getsingleorder(data.order_id).then(prods => {
            if (!data.success) {
              return;
            }
            const navigationExtras: NavigationExtras = {
              state: {
                massage: data.massage,
                products: prods,
                orderid: data.order_id,
                total: this.cartdataclient.total
              }
            };
            this.spinner.hide();
            this.router.navigate(['/thankyou'], navigationExtras).then(p => {
              this.cartdataclient = {total: 0, prodData: [{incart: 0, id: 0}]};
              this.cartTotal$.next(0);
              localStorage.setItem('cart', JSON.stringify(this.cartdataclient));
            });
          });

        });
      } else {
        this.spinner.hide();
        this.router.navigateByUrl('/checkout').then();
        this.toast.error(`sorry fail :(`, 'order status', {
          timeOut: 1500,
          progressBar: true,
          progressAnimation: 'increasing',
          positionClass: 'toast-top-right'
        });
      }
    });
  }

  private resetserverdata() {
    this.cartdataServer = {total: 0, data: [{numincart: 0, product: undefined}]};
    this.cartData$.next({...this.cartdataServer});
  }

  // gheymet har tedad az y kala
  calculatesubtotal(index): number {
    let subtotal = 0;
    const p = this.cartdataServer.data[index];
    subtotal = p.product.price * p.numincart;
    return subtotal;
  }


}

interface orderdresponse {
  order_id: number;
  success: boolean;
  massage: string;
  products: [{
    id: string,
    numincart: string
  }];
}

