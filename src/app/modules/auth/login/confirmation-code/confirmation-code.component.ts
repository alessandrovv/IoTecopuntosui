import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../_services/auth.service';
import { ToastrManager } from 'ng6-toastr-notifications';

@Component({
  selector: 'app-confirmation-code',
  templateUrl: './confirmation-code.component.html',
  styleUrls: ['./confirmation-code.component.scss']
})
export class ConfirmationCodeComponent implements OnInit {

  @Input() id: number;
  otpForm: FormGroup;
  isLoading:Boolean = false;
  constructor(
    private fb:FormBuilder,
    private cdr:ChangeDetectorRef,
    public modal:NgbActiveModal,
    private authService: AuthService,
    public toastr: ToastrManager,
  ) {
    

   }

  ngOnInit(): void {
    this.initForm();
  }

  ngAfterViewInit():void {
    this.initOtp();
    
  }

  initOtp(){
    const inputs = document.querySelectorAll('.otp-field input');
    inputs.forEach((input,index)=>{
      if(index!=0){
        input.setAttribute('disabled',"");
        input.classList.add('disabled');
      }
    });
  }

  initForm(){
    this.otpForm = this.fb.group({
      first:[null],
      second:[null],
      third:[null],
      fourth:[null],
      fifth:[null],
      sixth:[null]
    });
  }

  handleOtp(e){
    const inputs = document.querySelectorAll('.otp-field input');
    const input = e.target;
    let value = input.value;
    let isValidInput = value.match(/[0-9]/gi);
    if(!isValidInput){
      input.value = "";
      return;
    }
    let fieldIndex;
    inputs.forEach((item,index)=>{
      if(item==input){
        fieldIndex = index;
      }
    });
    
    //console.log(input);
    if(fieldIndex < inputs.length -1 && isValidInput){
      input.nextElementSibling.disabled= false;
      input.nextElementSibling.classList.remove('disabled');
      input.nextElementSibling.focus();
    }

    if(fieldIndex == inputs.length - 1 && isValidInput){
      this.submit();
    }
    //console.log(input.value);
  }


   submit():void{
    const f = this.otpForm.value;
    const otp = Object.values(f).join("");
    const inputs = document.querySelectorAll('.otp-field input');
    const first = document.getElementById('first');

    inputs.forEach((input,index)=>{
        input.classList.add('disabled');
    });
    this.otpForm.disable();
    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.verifyCodeByUser(this.id,otp,2).subscribe(
      (data:any)=>{
        if(data.Success){
          this.toastr.successToastr(data.Message, 'Correcto!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.modal.close();
          this.authService.redirectToMain();
        }else{
          this.toastr.errorToastr(data.Message, 'Error!', {
            toastTimeout: 2000,
            showCloseButton: true,
            animate: 'fade',
            progressBar: true
          });
          this.otpForm.reset();
          this.otpForm.enable();
          this.initOtp();
          first.classList.remove('disabled');
          first.focus();
          this.isLoading = false; 
          this.cdr.markForCheck();
        }
      }
    )
    
    //solo para probar el spinner xd
    /*setTimeout(()=>{
      this.otpForm.reset();
      this.otpForm.enable();
      this.initOtp();
      first.classList.remove('disabled');
      first.focus();
      this.isLoading = false; 
      this.cdr.markForCheck();

      setTimeout(()=>{
        //equisde
        this.modal.close();
      },1500);
    },2000);*/


    //console.log(otp);
    
  }



}
