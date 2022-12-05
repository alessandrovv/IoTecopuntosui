import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ObjetoCaracteristicasVehiculoService {

 
  private caracteristicaVehiculo: any;

  constructor() { }

  setcaracteristicaVehiculo(item){
    this.caracteristicaVehiculo = item;
  }

  getcaracteristicaVehiculo(){
    return this.caracteristicaVehiculo;
  }


}
