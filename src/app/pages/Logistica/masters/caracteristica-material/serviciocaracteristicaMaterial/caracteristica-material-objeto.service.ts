import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CaracteristicaMaterialObjetoService {

  private caracteristicaMaterial: any;

  constructor() { }

  setCaracteristicaMaterial(item){
    this.caracteristicaMaterial = item;
  }

  getCaracteristicaMaterial(){
    return this.caracteristicaMaterial;
  }


}
