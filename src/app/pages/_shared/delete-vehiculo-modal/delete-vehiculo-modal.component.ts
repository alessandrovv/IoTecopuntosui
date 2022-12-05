import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubcategoriaService } from '../../Logistica/_core/services/subcategoria.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { VehiculoService } from '../../Operations/_core/services/vehiculo.service';

@Component({
  selector: 'app-delete-vehiculo-modal',
  templateUrl: './delete-vehiculo-modal.component.html',
  styleUrls: ['./delete-vehiculo-modal.component.scss']
})
export class DeleteVehiculoModalComponent implements OnInit {

  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
		public vehiculo_s: VehiculoService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteVehiculo() {
    this.isLoading = true;
		this.vehiculo_s.DeleteVehiculo(this.id).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
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
