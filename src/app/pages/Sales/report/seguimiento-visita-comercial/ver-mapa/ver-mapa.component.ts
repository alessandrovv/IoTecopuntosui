import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Loader, LoaderStatus } from '@googlemaps/js-api-loader'
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { environment } from '../../../../../../environments/environment';
@Component({
  selector: 'app-ver-mapa',
  templateUrl: './ver-mapa.component.html',
  styleUrls: ['./ver-mapa.component.scss'],  
  providers: [DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class VerMapaComponent implements OnInit {
  @Input() cabecera: any;
  @Input() origen: any; 
  @Input() destino: any;
    title = 'My first AGM project';
  lat = 51.23333;
  lng = 7.809007; 
  constructor(
    private datePipe: DatePipe,
    public modal: NgbActiveModal,
  ) { }

  ngOnInit() {
    console.log('CABECERA:',this.cabecera);
    console.log('ORIGEN:',this.origen);
    console.log('DESTINO:',this.destino);
    let loader = new Loader({
      apiKey: environment.APIKEY_GOOGLE_MAPS,
    });
    let map;
    loader.load().then(()=>{
      map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: this.cabecera.latitudSucursal, lng: this.cabecera.longitudSucursal},
        zoom:15
      });
      new google.maps.Marker({
        position: {lat: this.cabecera.latitudSucursal, lng: this.cabecera.longitudSucursal},
        map:map,
        label:'SUCURSAL '+this.cabecera.cliente
        });
      if(this.origen !=null)
      new google.maps.Marker({
        position: {lat: this.origen.lat,lng: this.origen.lng},
        map:map,
        label: 'HORA INICIO: '+this.datePipe.transform(this.origen.label, 'h:mm:ss a'),
        });
      if(this.destino !=null)
      new google.maps.Marker({
        position: {lat: this.destino.lat,lng: this.destino.lng},
        map:map,
        label:'HORA FIN : '+this.datePipe.transform(this.destino.label, 'h:mm:ss a')
        });
    })
    
  }

}
