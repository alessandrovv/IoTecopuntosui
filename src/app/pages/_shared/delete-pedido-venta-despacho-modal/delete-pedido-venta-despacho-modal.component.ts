import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { PedidoVentaService } from '../../Sales/_core/pedido-venta.service';

@Component({
  selector: 'app-delete-pedido-venta-despacho-modal',
  templateUrl: './delete-pedido-venta-despacho-modal.component.html',
  styleUrls: ['./delete-pedido-venta-despacho-modal.component.scss']
})
export class DeletePedidoVentaDespachoModalComponent implements OnInit {

  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
		public pedido_venta_s: PedidoVentaService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteUsuario() {
    this.isLoading = true;
		this.pedido_venta_s.DeletePedidoVentaDespacho(this.id).subscribe(
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
