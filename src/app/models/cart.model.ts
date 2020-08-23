import {ProductModelServer} from './product.model';

export interface CartModelServer {
  total: number;
  data: [
    {
    product: ProductModelServer,
    numincart: number // tedad har item dar cart

  }
  ];


}

export interface CartModelpublic {
  total: number;
  prodData: [
    {
    id: number;
    incart: number
  }
  ];


}
