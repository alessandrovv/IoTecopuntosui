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

@Component({
  selector: 'app-recompensas-list',
  templateUrl: './recompensas-list.component.html',
  styleUrls: ['./recompensas-list.component.scss']
})
export class RecompensasListComponent implements OnInit {

  load_data: boolean = true;
  no_data: boolean = false;
  searchBan: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  listData: MatTableDataSource<any>;
  displayedColumns: string[] = ['Nro','Recompensa','Puntos','Activo', 'actions'];
  @ViewChild(MatSort) MatSort: MatSort;
  @ViewChild('matPaginator', { static: true }) paginator: MatPaginator;

  constructor(
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.listData = new MatTableDataSource([]);
    this.searchForm();
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

  getRecompensas(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
  }

}
