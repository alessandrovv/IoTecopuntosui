import { Component, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RolService } from '../../Security/_core/services/rol.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
@Component({
  selector: 'app-delete-rol-modal',
  templateUrl: './delete-rol-modal.component.html',
  styleUrls: ['./delete-rol-modal.component.scss']
})
export class DeleteRolModalComponent implements OnInit {
  @Input() id: number;
  @Input() titulo: string;
  @Input() nombre: string;
  @Input() msgloading: string;
  @Input() descripcion: string;

  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(public rol_s: RolService,
    public modal: NgbActiveModal,
    public toastr: ToastrManager,) { }

  ngOnInit(): void {
  }
  deleteRol() {
    this.isLoading = true;
		this.rol_s.DeleteRol(this.id).subscribe(
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
