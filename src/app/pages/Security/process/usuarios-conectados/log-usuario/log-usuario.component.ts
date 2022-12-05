import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { UsuarioService } from '../../../_core/services/usuario.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-log-usuario',
  templateUrl: './log-usuario.component.html',
  styleUrls: ['./log-usuario.component.scss']
})
export class LogUsuarioComponent implements OnInit {
  @Input() item: any;
  isLoading$;
  idCertificado: number = 0;
  formGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_cliente_externo: any;

  listData: MatTableDataSource<any>;
  displayedColumns: string[] = [ "Fecha", "Accion", "Ip"];

  constructor(
    private usuario_s: UsuarioService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
  ) { }

  ngOnInit(): void {
    this.getHistorialUsuario(this.item.idTrabajador);
  }



  getHistorialUsuario(Trabajador) {
    this.usuario_s.GetHistorialConexiones(Trabajador).subscribe(
      (data: any)=>{
        this.listData = new MatTableDataSource(data);
      }, (errorServicio)=>{
        console.error(errorServicio);        
      }
    )
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

}
