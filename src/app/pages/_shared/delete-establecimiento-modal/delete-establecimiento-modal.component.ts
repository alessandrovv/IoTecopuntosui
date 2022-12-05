import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EstablecimientoService } from '../../Logistica/_core/services/establecimiento.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-delete-establecimiento-modal',
  templateUrl: './delete-establecimiento-modal.component.html',
  styleUrls: ['./delete-establecimiento-modal.component.scss']
})
export class DeleteEstablecimientoModalComponent implements OnInit {

  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
		public establecimiento_s: EstablecimientoService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteUsuario() {
    this.isLoading = true;
		this.establecimiento_s.DeleteEstablecimiento(this.id).subscribe(
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
