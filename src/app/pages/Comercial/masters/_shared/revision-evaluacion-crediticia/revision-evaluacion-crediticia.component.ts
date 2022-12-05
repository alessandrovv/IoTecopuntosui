import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { EvaluacionCrediticiaService } from 'src/app/pages/Comercial/_core/evaluacion-crediticia.service';

@Component({
  selector: 'app-revision-evaluacion-crediticia',
  templateUrl: './revision-evaluacion-crediticia.component.html',
  styleUrls: ['./revision-evaluacion-crediticia.component.scss']
})
export class RevisionEvaluacionCrediticiaComponent implements OnInit {

  @Input() id: number; // no necesario
  @Input() titulo: string; // titulo del modal
  @Input() item: any; // titulo del modal
  
  downloadURL_2 : any = null;
  Codigo = new FormControl(null);
  Fecha = new FormControl(null);
  TipoDocIdentidad = new FormControl(null);
  DocIdentidad = new FormControl(null);

  ScoreCrediticio = new FormControl(null, Validators.compose([Validators.required]));
  FileImagen = new FormControl(null);
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  nombreArchivo: string = null;
  constructor(
    public modal: NgbActiveModal,
    public toastr: ToastrManager,
    private chgRef: ChangeDetectorRef,
    private storageFirebase: AngularFireStorage,
    public ventas_s: EvaluacionCrediticiaService
  ) { }

  ngOnInit(): void {
    console.log(this.item);
    this.nombreArchivo = this.item.nombreArchivo;
    this.downloadURL_2 = this.item.urlArchivo;
    this.Codigo.setValue(this.item.codigo);
    this.Fecha.setValue(this.item.fecha);
    this.TipoDocIdentidad.setValue(this.item.tipoDocumentoIdentidad);
    this.DocIdentidad.setValue(this.item.documentoIdentidad);
    this.ScoreCrediticio.setValue(this.item.ScoreCrediticio);
    this.chgRef.markForCheck();
  }

  chargeFile2() {
    let element: HTMLElement = document.getElementById('file2') as HTMLElement;
    element.click();
  }

  getFileDATARevision(event) {
    console.log(event);
    if(event.target.files && event.target.files.length) {
      let waitToastr = this.toastr.infoToastr('Cargando Imagen...', 'Cargando...', {
        dismiss: 'controlled',
        animate: 'fade',
        progressBar: true
      });
      const file = event.target.files[0];
      let nombreArchivo = file.name;
      let datoArchivo = nombreArchivo.split(".");
      let tipoDocumento = datoArchivo[datoArchivo.length-1];
      let filePath = '';

      filePath = 'EvaluacionCrediticio/' + nombreArchivo + Date.now() + '.' + datoArchivo[datoArchivo.length - 1];


      this.ref = this.storageFirebase.ref(filePath);
      this.task = this.ref.put(file);
      this.task.snapshotChanges().pipe(
        finalize(() => {
          this.ref.getDownloadURL().subscribe(url => {
            this.nombreArchivo = nombreArchivo;
            this.downloadURL_2 = url;
            waitToastr.dismiss();     
            this.chgRef.markForCheck();
          });
        })
      ).subscribe();

    }
  }

  saveRevisionCrediticia() {

    if (this.ScoreCrediticio.invalid) {
			this.ScoreCrediticio.markAsTouched()
			this.toastr.warningToastr('Ingrese un score crediticio.', 'Advertencia!', {
				toastTimeout: 3000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

    if (this.downloadURL_2 === null) {
			this.ScoreCrediticio.markAsTouched()
			this.toastr.warningToastr('Por favor adjunte una imagen.', 'Advertencia!', {
				toastTimeout: 3000,
				showCloseButton: true,
				animate: 'fade',
				progressBar: true
			});
			return;
		}

    let model = this.prepare_model();
    this.ventas_s.PostRevisionCrediticia(model).subscribe(
      (data:any) => {
        if (data[0].Ok > 0) {
          this.toastr.successToastr(data[0].Message, 'Correcto!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.modal.close(data); 
        } else {
          this.toastr.errorToastr(data[0].Message, 'Error!', {
            toastTimeout: 3000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
        }
      }, ( errorServicio ) => {  
        this.toastr.errorToastr('Ocurrio un error.', 'Error!', {
          toastTimeout: 3000,
          showCloseButton: true,
          animate: 'fade',
          progressBar: true
        });                 
      }
    );    
  }

  private prepare_model() {
    return {
      Venta: this.id,
      ScoreCrediticio: this.ScoreCrediticio.value,
      NombreArchivo: this.nombreArchivo,
      UrlArchivo: this.downloadURL_2          
    }
   
  }

  limpiarArchivo() {
    this.downloadURL_2 = null;
    this.FileImagen.reset();
    this.FileImagen = null;
    this.chgRef.markForCheck();
  }

  isControlValid(controlName: string): boolean {
		const control = this.ScoreCrediticio;
		return control.valid && (control.dirty || control.touched);
	}

	isControlInvalid(controlName: string): boolean {
		const control = this.ScoreCrediticio;
		return control.invalid && (control.dirty || control.touched);
	}

	controlHasError(validation, controlName): boolean {
    console.log('object');
		const control = this.ScoreCrediticio;
		return control.hasError(validation) && (control.dirty || control.touched);
	}


}
