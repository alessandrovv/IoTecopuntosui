import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgbDateAdapter, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Subscription } from 'rxjs';
import { TableResponseModel } from 'src/app/_metronic/shared/crud-table';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/_metronic/core';
import { finalize } from 'rxjs/operators';
import { EstudiantesService } from '../_services/estudiantes.service';

@Component({
  selector: 'app-estudiantes-list',
  templateUrl: './estudiantes-list.component.html',
  styleUrls: ['./estudiantes-list.component.scss']
})
export class EstudiantesListComponent implements OnInit {

  load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['Nro','Nombre','Escuela','Codigo','Puntos', 'Activo', 'actions'];
    @ViewChild(MatSort) MatSort: MatSort;
    @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private estudiante_s:EstudiantesService,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.searchForm();
    this.getEstudiantes();
  }

  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [''],
    });    
  }

  search() {
    if(this.searchGroup.controls.searchTerm.value == null) {
      this.searchGroup.controls.searchTerm.setValue('');
    }
    this.listData.filter = this.searchGroup.controls.searchTerm.value.trim().toLowerCase();
    if (this.listData.paginator) {
      this.listData.paginator.firstPage();
    }
  }

  getEstudiantes(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
    this.estudiante_s.GetEstudiantes().subscribe(
      (data:any)=>{
        console.log('Lista Estudiantes:', data);

        this.load_data = true;
        this.searchBan = false;
        this.listData = new MatTableDataSource(data.data);
        if(data.data.length > 0){
          this.no_data = true;
        }else{
          this.no_data = false;
        }
        this.listData.sort = this.MatSort;
        this.listData.paginator = this.paginator;
      },(error)=>{
        console.log('Error Estudiantes:', error);
        this.load_data = true;
        this.no_data = false;
        this.searchBan = false;
      }
    )

  }

  getTest(){
    this.estudiante_s.GetTest().subscribe(
      (data:any)=>{
        console.log(data);
      },(error)=>{
        console.log(error);
      }
    )
  }

}
