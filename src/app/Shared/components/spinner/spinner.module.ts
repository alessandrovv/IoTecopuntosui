import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from './spinner.component';



@NgModule({
  declarations: [SpinnerComponent],
  imports: [
    CommonModule
  ], exports: [SpinnerComponent] //Aqui se pone que el modulo esta disponble para otros

})
export class SpinnerModule { }
