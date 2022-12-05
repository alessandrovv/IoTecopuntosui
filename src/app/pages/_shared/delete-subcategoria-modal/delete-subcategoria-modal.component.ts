import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubcategoriaService } from '../../Logistica/_core/services/subcategoria.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-delete-subcategoria-modal',
  templateUrl: './delete-subcategoria-modal.component.html',
  styleUrls: ['./delete-subcategoria-modal.component.scss']
})
export class DeleteSubcategoriaModalComponent implements OnInit {

  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
		public subcategoria_s: SubcategoriaService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteUsuario() {
    this.isLoading = true;
		this.subcategoria_s.DeleteSubcategoria(this.id).subscribe(
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
