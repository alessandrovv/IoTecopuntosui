import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { ToastrManager } from 'ng6-toastr-notifications';
import { TipoVehiculoService } from '../../../_core/services/tipo-vehiculo.service';

@Component({
  selector: 'app-eliminar-tipovehiculo',
  templateUrl: './eliminar-tipovehiculo.component.html',
  styleUrls: ['./eliminar-tipovehiculo.component.scss']
})
export class EliminarTipovehiculoComponent implements OnInit {
  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    public tipoVehiculo_s: TipoVehiculoService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }
  deleteCategoriaMaterial() {
    this.isLoading = true;
		this.tipoVehiculo_s.DeleteTipoVehiculo(this.id).subscribe(
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
