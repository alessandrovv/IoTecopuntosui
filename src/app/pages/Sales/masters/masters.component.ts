import { Component, OnInit } from '@angular/core';
import { MaterialService } from '../../Logistica/_core/services/material.service';

@Component({
  selector: 'app-masters',
  templateUrl: './masters.component.html'
})
export class MastersComponent implements OnInit {

  constructor(
    public test_s: MaterialService,
  ) { }

  ngOnInit(): void {
  }

}
