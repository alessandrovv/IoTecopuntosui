import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { CertificadosService } from '../../Talento/_core/services/certificados.service';
import { DocumentoService } from '../../Talento/_core/services/documento.service';
import { TrabajadorService } from '../../Talento/_core/services/trabajador.service';
import { equipoComercialService } from '../../Talento/_core/services/equipoComercial.service';
import { VentasService } from '../../Comercial/_core/ventas.service';
import { MaterialService } from '../../Logistica/_core/services/material.service';
import { ClaseMaterialService } from '../../Logistica/_core/services/clase-material.service';
import { CaracteristicasVehiculoService } from '../../Operations/_core/services/caracteristicas-vehiculo.service';
@Component({
  selector: 'app-delete-caracteristicas-vehiculo-modal',
  templateUrl: './delete-caracteristicas-vehiculo-modal.component.html',
  styleUrls: ['./delete-caracteristicas-vehiculo-modal.component.scss']
})
export class DeleteCaracteristicasVehiculoModalComponent implements OnInit {

  @Input() id: number;
  @Input() tipo: number;
  @Input() titulo: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private caracteristicaVehicuslo_S: CaracteristicasVehiculoService, 
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteCertificado() {
    this.isLoading = true;

    if (this.tipo === 1) {
      this.deleteCaracteristicaVehiculo()
    }

    if (this.tipo === 2) {
      this.deleteCaracteristicaVehiculoValor()
    }

  }


  private deleteCaracteristicaVehiculo(){
    this.caracteristicaVehicuslo_S.deleteCaracteristicaeMaterial(this.id).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.isLoading = false;
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.isLoading = false;
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    );
  }
  private deleteCaracteristicaVehiculoValor(){
    this.caracteristicaVehicuslo_S.deleteCaracteristicaVehiculoValor(this.id).subscribe(
      (data:any) => {
        if (data[0].Success > 0) {
          this.isLoading = false;
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });

          this.modal.close(true);  
        } else {
          this.isLoading = false;
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
               
      }, ( errorServicio ) => { 
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });       
        console.log(errorServicio);
      }
    );
  }

}
