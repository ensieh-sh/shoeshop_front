import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private products: Productresponsemodel[] = [];
  private SERVER_URL = environment.SERVER_URL;


  constructor(private http: HttpClient) {
  }

  getsingleorder(orderid: number) {
    return this.http.get<Productresponsemodel[]>(this.SERVER_URL + '/orders/' + orderid).toPromise();
    // toPromise observable ro b prmise tabdil mikone badesh mitunim .then biarim
  }
}

interface Productresponsemodel {
  id: number;
  title: string;
  description: string;
  price: number;
  quantityorderd: number;
  image: string;

}
