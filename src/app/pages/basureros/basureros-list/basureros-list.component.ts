import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-basureros-list',
  templateUrl: './basureros-list.component.html',
  styleUrls: ['./basureros-list.component.scss']
})
export class BasurerosListComponent implements OnInit {

  load_data: boolean = true;
    no_data: boolean = false;
    searchBan: boolean = false;
    filterGroup: FormGroup;
    searchGroup: FormGroup;
    listData: MatTableDataSource<any>;
    displayedColumns: string[] = ['Nro','Codigo','Escuela', 'Activo', 'actions'];
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

  getBasureros(){
    this.listData = new MatTableDataSource([]);
    this.searchBan = false;
    this.load_data = false;
    this.no_data = true;
  }

}
