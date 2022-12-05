import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, delay, finalize, tap } from 'rxjs/operators';
import { EsquemaComisionService } from '../../Finanzas/_core/services/esquema-comision.service';


@Component({
  selector: 'app-delete-esquema-comision',
  templateUrl: './delete-esquema-comision.component.html',
  styleUrls: ['./delete-esquema-comision.component.scss']
})
export class DeleteEsquemaComisionComponent implements OnInit {
  @Input() id: number;
  isLoading = false;
  subscriptions: Subscription[] = [];

  constructor(
    private esquema_s: EsquemaComisionService, 
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
  }

  deleteEsquemaComision() {
    this.isLoading = true;
    this.esquema_s.DeleteEsquemaComision({idEsquemaComision: this.id}).subscribe(
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
