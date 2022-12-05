import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NgbActiveModal, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { of, Subscription } from 'rxjs';
import { catchError, finalize, first, tap } from 'rxjs/operators';
import { Customer } from 'src/app/modules/e-commerce/_models/customer.model';
import { CustomersService } from 'src/app/modules/e-commerce/_services';
import { CustomAdapter, CustomDateParserFormatter, getDateFromString } from '../../../../../_metronic/core';
import { CertificadosService } from '../../../_core/services/certificados.service';
import { equipoComercialService } from '../../../_core/services/equipoComercial.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-search-asesor-comercial',
  templateUrl: './search-asesor-comercial.component.html',
  styleUrls: ['./search-asesor-comercial.component.scss'],
  providers: [DatePipe,
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class SearchAsesorComercialComponent implements OnInit {
  @Input() Empresa: any;
  isLoading$;
  filterGroup: FormGroup;
  private subscriptions: Subscription[] = [];
  array_empresas: any;
  array_cliente_externo: any;
  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  array_data: any = [];
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Select', 'Codigo', 'NombresTrabajador', 'DocIdentidad', 'Direccion', 'Edad', 
                              'Sexo'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private customersService: CustomersService,
    private fb: FormBuilder, 
    public modal: NgbActiveModal,
    public equipo_s: equipoComercialService,
    public toastr: ToastrManager,
    private datePipe: DatePipe,
    ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.isLoading$ = this.customersService.isLoading$;
    this.filterForm(); 
    this.obtenerAsesoresComerciales(this.Empresa);
  }

  obtenerAsesoresComerciales(empresa) {
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;

    this.equipo_s.GetAsesoresComercialesList(empresa).subscribe(
      (data:any) => {
        console.log(data);
        this.array_data = data;
        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(this.array_data);
        if(data.length > 0){
          this.no_data = true;
        } else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;       
      }, ( errorServicio ) => {
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;        
      }
    );

  }

  filterForm() {
    this.filterGroup = this.fb.group({
      FechaInicio: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
      searchTerm: [''],
    });    
  }

  search() {
    if(this.filterGroup.controls.searchTerm.value == null) {
      this.filterGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.filterGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  save() {
    let result = this.array_data.filter(item=> item.Selected === true);
    for(let i= 0; i <= result.length - 1; i++) {
      result[i].FechaIngreso = this.filterGroup.controls.FechaInicio.value;
      result[i].EquipoDetalle = 0;
      result[i].FechaSalida = null;
      result[i].Eliminado = 0;
    }
    this.modal.close(result); 
  }

  isControlValid(controlName: string): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }
  
  isControlTouched(controlName): boolean {
    const control = this.filterGroup.controls[controlName];
    return control.dirty || control.touched;
  }


  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
 
}
