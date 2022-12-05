import { ToastrManager } from 'ng6-toastr-notifications';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { CategoriaMaterialService } from '../../../_core/services/categoria-material.service';

@Component({
  selector: 'app-eliminar-categoria-material',
  templateUrl: './eliminar-categoria-material.component.html',
  styleUrls: ['./eliminar-categoria-material.component.scss']
})
export class EliminarCategoriaMaterialComponent implements OnInit {
  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;

  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(public categorires_s: CategoriaMaterialService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,) { }

  ngOnInit(): void {
  }
  deleteCategoriaMaterial() {
    this.isLoading = true;
		this.categorires_s.DeleteCategoriaMaterial(this.id).subscribe(
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
