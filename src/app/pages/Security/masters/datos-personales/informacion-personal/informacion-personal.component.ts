import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DeleteRolModalComponent } from 'src/app/pages/_shared/delete-rol-modal/delete-rol-modal.component';
import { ToastrManager } from 'ng6-toastr-notifications';
import { MultitablaService } from 'src/app/pages/_core/services/multitabla.service';
import { Router } from '@angular/router';
import { DatosPersonalesService } from '../../../_core/services/datos-personales.service';
import { DeleteModalGeneralComponent } from 'src/app/pages/_shared/delete-modal/delete-modal.component';

@Component({
  selector: 'app-informacion-personal',
  templateUrl: './informacion-personal.component.html',
  styleUrls: ['./informacion-personal.component.scss']
})
export class InformacionPersonalComponent implements OnInit {

  formDatosPersonales: FormGroup;
  subscriptions: Subscription[] = [];

  array_dataList: any;

  constructor(
    private fb: FormBuilder,
    public datosPersonales_s: DatosPersonalesService,
  ) { }

  ngOnInit(): void {
    this.datosForm();
    this.getTrabajador();
  }

  datosForm(){
    this.formDatosPersonales = this.fb.group({
      Nombre: [null],
      ApePaterno: [null],
      ApeMaterno: [null],
      Telefono: [null],
      Celular: [null],
      Email: [null],
    });
  }

  getTrabajador(){
    this.datosPersonales_s.GetTrabajadorByUsuario().subscribe(
      (data:any) => {
        let dataGenerales = data[0]; 
        this.formDatosPersonales.controls.Nombre.setValue(dataGenerales.nombres);   
        this.formDatosPersonales.controls.ApePaterno.setValue(dataGenerales.apePaterno);
        this.formDatosPersonales.controls.ApeMaterno.setValue(dataGenerales.apeMaterno);
        this.formDatosPersonales.controls.Telefono.setValue(dataGenerales.telefono);
        this.formDatosPersonales.controls.Celular.setValue(dataGenerales.celular);
        this.formDatosPersonales.controls.Email.setValue(dataGenerales.email);
      
      }, ( errorServicio ) => {           
        console.log(errorServicio);
      }
    );
  }
}
