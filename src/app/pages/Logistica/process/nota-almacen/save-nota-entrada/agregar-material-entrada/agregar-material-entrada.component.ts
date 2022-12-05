import { Component, OnInit, ViewChild, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { Navigation } from 'src/app/modules/auth/_core/interfaces/navigation';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrManager } from 'ng6-toastr-notifications';
import { PermissionViewActionService } from 'src/app/Shared/services/permission-view-action.service';
import { MaterialService } from '../../../../_core/services/material.service';
import { DatePipe } from '@angular/common';
import { NotaAlmacenService } from '../../../../_core/services/nota-almacen.service';

@Component({
  selector: "app-agregar-material-entrada",
  templateUrl: "./agregar-material-entrada.component.html",
  styleUrls: ["./agregar-material-entrada.component.scss"],
  providers: [
    DatePipe,
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class AgregarMaterialEntradaComponent implements OnInit {
  @Input() array_materiales: any;
  @Input() igv: any;
  @Input() almacen: any;
  /* Variables para la tabla de materiales */
  array_clases: any = [];
  array_categorias: any = [];
  array_subcategorias: any = [];
  searchBan: boolean = false;
  listMateriales: MatTableDataSource<any>;
  displayedColumns: string[] = [
    "Codigo",
    "Material",
    "Categoria",
    "Subcategoria",
    "Clase",
    "Marca",
    "Modelo",
    "Acciones",
  ];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild("matPaginator", { static: true }) paginator: MatPaginator;
  filterGroupMat: FormGroup;

  /* Variables datos del material seleccionado */
  formDatosMaterial: FormGroup;
  material: any;
  cantidad: number = 0;
  valorUnitario: number = 0;
  valorVenta: number = 0;

  validViewAction = this.pvas.validViewAction;
  viewsActions: Array<Navigation> = [];

  constructor(
    private fb: FormBuilder,
    public pvas: PermissionViewActionService,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private nota_almacen_s: NotaAlmacenService,
    private materiales_s: MaterialService,
    public modalService: NgbModal,
    public modal: NgbActiveModal
  ) {}

  ngOnInit(): void {
    this.viewsActions = this.pvas.get();
    this.filterGroupMateriales();
    this.formGroupDatosMaterial();
    this.getSubCategoria(0);
    this.getClase(0);
    this.getMateriales(0, 0, this.almacen);
  }

  /* Datos del material */

  formGroupDatosMaterial() {
    let regexEntMay = /^[1-9]\d*$/;
    let regexDecMay =
      /^([1-9]\d*(\.\d*[1-9][0-9])?)|(0\.\d*[1-9][0-9])|(0\.\d*[1-9])$/;
    this.formDatosMaterial = this.fb.group({
      Material: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      UnidadMedida: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Stock: [
        { value: null, disabled: true },
        Validators.compose([Validators.required]),
      ],
      Cantidad: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexEntMay),
        ]),
      ],
      ValorUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      ValorVenta: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.pattern(regexDecMay),
        ]),
      ],
      Observacion: [null],
    });
  }

  get controlsDatos() {
    return this.formDatosMaterial.controls;
  }

  /* Funciones para materiales */

  filterGroupMateriales() {
    this.filterGroupMat = this.fb.group({
      searchMaterial: [""],
      Categoria: [null],
      SubCategoria: [null],
      Clase: [null],
    });
  }

  get controlsFilter() {
    return this.filterGroupMat.controls;
  }

  searchMaterial() {
    if (this.filterGroupMat.controls.searchTerm.value == null) {
      this.filterGroupMat.controls.searchTerm.setValue("");
    }
    this.listMateriales.filter = this.filterGroupMat.controls.searchTerm.value
      .trim()
      .toLowerCase();
    if (this.listMateriales.paginator) {
      this.listMateriales.paginator.firstPage();
    }
  }

  buscarSubcategoria(val) {
    this.array_clases.forEach((item) => {
      if (item.Clase == val) {
        this.controlsFilter.SubCategoria.setValue(item.Subcategoria);
      }
    });
  }

  getSubCategoria(categoria) {
    this.controlsFilter.SubCategoria.reset();
    this.materiales_s.GetSubcategorias(categoria).subscribe(
      (data: any) => {
        this.array_subcategorias = data;
        this.array_subcategorias.unshift({
          Subcategoria: 0,
          Categoria: 0,
          NombreSubcategoria: "Todos",
        });
        this.controlsFilter.SubCategoria.setValue(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getClase(subcategoria) {
    this.controlsFilter.Clase.reset();
    subcategoria = subcategoria ? subcategoria : 0;
    this.materiales_s.GetClases(subcategoria).subscribe(
      (data: any) => {
        this.array_clases = data;
        this.array_clases.unshift({
          Clase: 0,
          Subcategoria: 0,
          Categoria: 0,
          NombreClase: "Todos",
        });
        this.controlsFilter.Clase.setValue(0);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  getMateriales(subcategoria, clase, almacen) {
    this.listMateriales = new MatTableDataSource([]);
    this.searchBan = false;
    subcategoria = subcategoria ? subcategoria : 0;
    clase = clase ? clase : 0;
    this.nota_almacen_s.GetMateriales(0, subcategoria, clase, almacen).subscribe(
      (data: any) => {
        this.searchBan = false;
        this.listMateriales = new MatTableDataSource(data);
        this.listMateriales.sort = this.MatSort;
        this.listMateriales.paginator = this.paginator;
        this.chgRef.markForCheck();
      },
      (error) => {
        console.log(error);
      }
    );
  }

  seleccionarMaterial(material) {
    this.material = material;
    this.controlsDatos.Material.setValue(material.nombreMaterial);
    this.controlsDatos.UnidadMedida.setValue(material.unidadMedida);
    this.controlsDatos.Stock.setValue(material.stock.toFixed(2));
    this.chgRef.markForCheck();
  }

  keyUpCantidad() {
    this.cantidad = this.controlsDatos.Cantidad.value;
    this.valorUnitario = this.controlsDatos.ValorUnitario.value;
    if (this.cantidad > 0) {
      this.valorVenta = this.cantidad * this.valorUnitario;
      if (this.valorUnitario > 0) {
        this.controlsDatos.ValorVenta.setValue(this.valorVenta.toFixed(2));
      }
    } else {
      this.controlsDatos.ValorVenta.setValue(0);
    }
  }

  keyUpValorUnitario() {
    this.cantidad = this.controlsDatos.Cantidad.value;
    this.valorUnitario = this.controlsDatos.ValorUnitario.value;
    if (this.cantidad > 0 && this.valorUnitario > 0) {
      this.valorVenta = this.cantidad * this.valorUnitario;
      if (this.valorVenta > 0) {
        this.controlsDatos.ValorVenta.setValue(this.valorVenta.toFixed(2));
      }
    } else {
      this.controlsDatos.ValorVenta.setValue(0);
    }
  }

  save() {
    let rep = this.array_materiales.find(
      (e) => e.idMaterial == this.material.idMaterial
    );
    if (rep) {
      this.toastr.warningToastr(
        "El material ya se encuentra registrado. ",
        "Advertencia!",
        {
          toastTimeout: 2000,
          showCloseButton: true,
          animate: "fade",
          progressBar: true,
        }
      );
    } else {
      this.material.cantidad = this.cantidad;
      this.material.cantidadTotal = 0;
      this.material.valorUnit = this.valorUnitario.toFixed(2);
      this.material.valorTotal = this.valorVenta.toFixed(2);
      this.material.precioUnit = (
        this.valorUnitario *
        (1 + this.igv / 100)
      ).toFixed(2);
      this.material.precioTotal = (
        parseFloat(this.material.precioUnit) * this.cantidad
      ).toFixed(2);
      this.material.observacion = this.controlsDatos.Observacion.value;

      this.modal.close(this.material);
    }
  }

  /* Validacion de formularios */
  isFormControlValid(controlName): boolean {
    return controlName.valid && (controlName.dirty || controlName.touched);
  }

  isFormControlInvalid(controlName): boolean {
    return controlName.invalid && (controlName.dirty || controlName.touched);
  }

  FormControlHasError(validation, controlName): boolean {
    return (
      controlName.hasError(validation) &&
      (controlName.dirty || controlName.touched)
    );
  }
}
