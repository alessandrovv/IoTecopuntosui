import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import Swiper,{Navigation,Pagination} from 'swiper';
import { VisitaComercialService } from '../../../_core/visita-comercial.service';
Swiper.use([Navigation,Pagination]);
@Component({
  selector: 'app-ver-evidencia',
  templateUrl: './ver-evidencia.component.html',
  styleUrls: ['./ver-evidencia.component.scss']
})
export class VerEvidenciaComponent implements OnInit,AfterViewInit {
  @Input() item: any; 
  @Input() cabecera: any;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  array_evidenciaVisitComercial:any = null;
  constructor(
    
		public visitaComercial_s: VisitaComercialService,
    public modal: NgbActiveModal,
    private storage: AngularFireStorage,
  ) { }
  ngOnInit() {
    if(this.item !=null){
      this.GetEvidenciaByVisitaComercial(this.item);
    }else{
      this.item = null;
    }

  }

  GetEvidenciaByVisitaComercial(VisitaComercial){
    this.visitaComercial_s.GetEvidenciaByVisitaComercial(VisitaComercial).subscribe(
			(data: any) => {
				this.array_evidenciaVisitComercial = data;        
        if(this.array_evidenciaVisitComercial.length == 0){
          this.array_evidenciaVisitComercial = null;
        }
			}, (errorServicio) => {
				console.log(errorServicio);
			}
		);
  }

  ngAfterViewInit() {
    new Swiper(".mySwiper", {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      });
  }

}
