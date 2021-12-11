import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import {
  NgbDateParserFormatter,
  NgbDatepickerConfig,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  fundForm: FormGroup;
  sectionNo = 1;
  isDropdownDisabled = false;
  isSimpleOption = false;
  items: any;
  today = new Date();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  noNeed = false;
  disable = true;
  dropdownSettings = {};
  dropdownSingleSettings = {};

  // Data for dropdowns
  domicileData = [
    { value: 'singapore', viewValue: 'Singapore' },
    { value: 'hong-kong', viewValue: 'Hong Kong' },
    { value: 'british-virgin-is', viewValue: 'British Virgin Is' },
    { value: 'cayman-is', viewValue: 'Cayman Is' },
  ];

  fundStatusData = [
    { value: 'onboarding', viewValue: 'On boarding' },
    { value: 'open', viewValue: 'Open' },
    { value: 'funded', viewValue: 'Funded' },
    { value: 'refund', viewValue: 'Re fund' },
    { value: 'freeze', viewValue: 'Freeze' },
    { value: 'unfreeze', viewValue: 'Unfreeze' },
    { value: 'close', viewValue: 'Close' },
    { value: 'extendterm', viewValue: 'Extend term' },
  ];

  currencyData = [
    { value: 'USD', viewValue: 'USD' },
    { value: 'CNY', viewValue: 'CNY' },
    { value: 'EUR', viewValue: 'EUR' },
    { value: 'HKD', viewValue: 'HKD' },
    { value: 'JPY', viewValue: 'JPY' },
    { value: 'SGD', viewValue: 'SGD' },
  ];

  monthsData = [
    {
      value: 'Jan',
      viewValue: 'January',
    },
    {
      value: 'Feb',
      viewValue: 'February',
    },
    {
      value: 'Mar',
      viewValue: 'March',
    },
    {
      value: 'Apr',
      viewValue: 'April',
    },
    {
      value: 'May',
      viewValue: 'May',
    },
    {
      value: 'Jun',
      viewValue: 'June',
    },
    {
      value: 'Jul',
      viewValue: 'July',
    },
    {
      value: 'Aug',
      viewValue: 'August',
    },
    {
      value: 'Sep',
      viewValue: 'September',
    },
    {
      value: 'Oct',
      viewValue: 'October',
    },
    {
      value: 'Nov',
      viewValue: 'November',
    },
    {
      value: 'Dec',
      viewValue: 'December',
    },
  ];

  productTypeData = [
    { value: 'private-equity', viewValue: 'Private Equity' },
    { value: 'private-debt', viewValue: 'Private Debt' },
    { value: 'fund-of-funds', viewValue: 'Fund of funds' },
    { value: 'family-funds', viewValue: 'Family funds' },
    { value: 'trust', viewValue: 'Trust' },
    { value: 'multistrategy', viewValue: 'Multi strategy' },
  ];

  reportingFrequencyData = [
    { value: 'weekly', viewValue: 'Weekly' },
    { value: 'fortnight', viewValue: 'Weekly' },
    { value: 'month', viewValue: 'Month' },
    { value: 'quarter', viewValue: 'Quarter' },
    { value: 'semi-annual', viewValue: 'Semi Annual' },
    { value: 'annual', viewValue: 'Annual' },
  ];

  bankData = [
    { value: 'citibank', viewValue: 'Citibank' },
    { value: 'DBS', viewValue: 'DBS' },
    { value: 'OCBC', viewValue: 'OCBC' },
    { value: 'standard-chartered', viewValue: 'Standard Chartered' },
    { value: 'UOB', viewValue: 'UOB' },
  ];

  globalDisable = false;

  directors: any = [];

  constructor(
    private config: NgbDatepickerConfig,
    private apiService: APIService,
    private ngbDateParserFormatter: NgbDateParserFormatter,
    private _snackBar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.apiService.getDirectors().subscribe(
      (result: any) => {
        if (result.status == 'ok') {
          this.directors = result.directors;
          this.setMultiDropdownSettings();
          this.setSingleDS();
        } else {
          this.directors = [];
          this.setMultiDropdownSettings();
          this.setSingleDS();
        }
      },
      (err) => {
        this.directors = [];
        this.setMultiDropdownSettings();
        this.setSingleDS();
      }
    );
  }

  refreshDirectors(event: any) {
    this.directors = event;
  }

  checkDeleteAvailibility(name: string) {
    return this.fundForm.get(name)?.value.length > 1;
  }

  checkAddAvailibility(name: string, index: number) {
    return index == this.fundForm.get(name)?.value.length - 1 ? true : false;
  }

  getFundStatusHeading(value: string) {
    if (value == 'extendterm') return 'Extend Term';
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  setMultiDropdownSettings() {
    return (this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'director_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      enableCheckAll: true,
    });
  }

  isNumberOnly(event: any) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  setSingleDS() {
    return (this.dropdownSingleSettings = {
      singleSelection: true,
      idField: 'id',
      textField: 'director_name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 4,
      allowSearchFilter: true,
      enableCheckAll: true,
    });
  }

  ngOnInit(): void {
    // Section 1:
    this.fundForm = this.formBuilder.group({
      fundName: ['', [Validators.required, Validators.maxLength(5)]],
      registrationNumber: ['', [Validators.required, Validators.maxLength(50)]],
      fundDescription: ['', [Validators.required, Validators.maxLength(2048)]],
      subFund: ['N', []],
      domicile: ['singapore', []],
      fundType: ['regulated', []],
      fundManagerEntity: ['', []],
      fundManagerRep: ['', [Validators.required]],
      fundStructure: ['open-ended', []],
      offerPrice: [1.0, []],
      fundSize: [0.0, []],
      issuedShares: [1, []],
      ordinaryShare: [1, []],
      fundStatus: ['onboarding', []],
      fundStatusReason: ['', []],
      reportingCurrency: ['USD', []],
      lockupPeriod: [0, []],
      fundYearEnd: ['Dec', []],
      productType: ['private-equity', []],
      fundLifeYears: [null, []],
      boardExtension: [null, []],
      investorExtension: [null, []],
      fundLifedocuments: [null, []],
      fundEndDate: [null, []],
      catchup: [0.0, []],

      // Section 2:
      reportingFrequency: ['month', []],
      legalCounsel: ['', []],
      legalCounselRep: ['', []],
      auditor: ['', []],
      auditorRep: ['', []],
      trustee: ['', []],
      trusteeRep: ['', []],
      investmentComittee: [[], [Validators.required]],
      directorsList: this.formBuilder.array(this.TransformDirectors()),
      subscribers: this.formBuilder.array(this.TransformSubscribers()),
      // Section 3:
      authorizedSignatory: [[], [Validators.required]],
      signature: [null, [Validators.required]],
      boardResolutions: [null, [Validators.required]],
      fundAdmin: ['', [Validators.required]],
      GIIN: ['', [Validators.required, Validators.maxLength(50)]],
      preparer: ['', []],
      closingPeriods: this.formBuilder.array(this.TransformClosingPeriods()),
      reclassificationFreq: ['month', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [0.0, []],
      managementFee: [0.0, []],
      hurdleRate: [0.0, []],
      CTC: [0.0, []],
      bank: ['OCBC', []],
      bankAccount: ['', [Validators.required, Validators.maxLength(50)]],
      bankAccessId: ['', [Validators.required, Validators.maxLength(50)]],
      bankAccessPassword: ['', [Validators.required, Validators.maxLength(50)]],

      // Section 4:
      redeem: ['', []],
      redeemReason: ['', []],
      liquidate: ['', []],
      liquidateReason: ['', []],

      created_at: ['', []],
      updated_at: ['', []],
    });

    const current = new Date();
    this.config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.config.outsideDays = 'hidden';

    this.fundForm.get('fundType')!.valueChanges.subscribe((value) => {
      if (value === 'regulated') {
        this.fundForm
          .get('fundManagerEntity')!
          .setValidators([Validators.required, Validators.maxLength(256)]);
      } else {
        this.fundForm.get('fundManagerEntity')!.setValidators(null);
      }

      this.fundForm.get('fundManagerEntity')!.updateValueAndValidity();
    });

    this.fundForm.get('redeem')!.valueChanges.subscribe((value) => {
      if (value) {
        this.fundForm
          .get('redeemReason')!
          .setValidators([Validators.required, Validators.maxLength(256)]);
      } else {
        this.fundForm.get('fundManagerEntity')!.setValidators(null);
      }

      this.fundForm.get('redeemReason')!.updateValueAndValidity();
    });

    this.fundForm.valueChanges.subscribe((val) => {
      if (val.fundSize && val.offerPrice) {
        const issuedShareValue = val.fundSize / val.offerPrice;
        this.fundForm.controls.issuedShares.patchValue(issuedShareValue, {
          emitEvent: false,
        });
      }

      if (val.subscribers && val.subscribers.length && this.fundForm.get('fundSize')?.value) {
        let sum: number = 0;
        val.subscribers.map((amount: any) => {
          sum = sum + amount.commitment;
          if(sum <= this.fundForm.get('fundSize')?.value){
            this.globalDisable = true;
          }else{
            this.globalDisable = false; 
          }
        });
      }
    });
  }

  refresh() {
    return (this.directors = [...this.directors]);
  }

  StatusChange(event: any) {
    let value = event.target.value;
    if (value == 'funded' || value == 'frozen' || value == 'close') {
      this.fundForm.disable();
      this.fundForm.get('fundStatus')?.enable();
      this.isDropdownDisabled = true;
    } else {
      this.fundForm.enable();
      this.fundForm.get('fundStatus')?.enable();
      this.isDropdownDisabled = false;
    }

    if (
      this.fundForm.get('fundStatus')?.value == 'freeze' ||
      this.fundForm.get('fundStatus')?.value == 'unfreeze' ||
      this.fundForm.get('fundStatus')?.value == 'refund' ||
      this.fundForm.get('fundStatus')?.value == 'extendterm'
    ) {
      this.fundForm
        .get('fundStatusReason')
        ?.setValidators([Validators.required, Validators.maxLength(2048)]);
    } else {
      this.fundForm.get('fundStatusReason')!.setValidators(null);
    }

    if (value != 'onboarding') {
      this.fundForm
        .get('legalCounsel')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('legalCounselRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('auditor')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('auditorRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('trustee')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('trusteeRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);
    } else {
      this.fundForm.get('fundManagerEntity')!.setValidators(null);
    }

    this.fundForm.get('fundManagerEntity')!.updateValueAndValidity();
  }

  StructureChange(event: any) {
    let value = event.target.value;
    if (value == 'close-ended') {
      this.isSimpleOption = true;
    } else {
      this.isSimpleOption = false;
    }
  }

  handleFileInput(name: string, event: any) {
    const formData: FormData = new FormData();
    let file = event.target.files[0];
    formData.append('file', file, file['name']);
    this.fundForm.get(name)?.setValue(formData);
    file = undefined;
  }

  handleFileInputDirector(index:number,event:any){
    let control = this.fundForm.get('directorsList')?.value[index];
    const formData: FormData = new FormData();
    let file = event.target.files[0];
    formData.append('file', file, file['name']);
    control.signature = (formData);
    file = undefined;
  }

  handleFilMultipleInput(name: string, event: any) {
    let selectedFiles: any = undefined;
    selectedFiles = event.target.files;
    for (let i = 0; i < event.target.files; i++) {
      selectedFiles.push(event.target.files[i]);
    }
    const formData = new FormData();
    if (selectedFiles.length > 0) {
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append('files', selectedFiles[i]);
        if (i == selectedFiles.length - 1) {
          this.fundForm.get(name)?.setValue(formData);
          console.log(formData.getAll('files'));
          selectedFiles = [];
        }
      }
    }
  }

  TransformSubscribers(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        name: ['', [Validators.required]],
        commitment: [0.0, [Validators.required]],
      })
    );

    return fb;
  }

  TransformClosingPeriods(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        date: ['', [Validators.required]],
      })
    );

    return fb;
  }

  TransformDirectors(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        name: ['', [Validators.required]],
        signature: [null, [Validators.required]],
      })
    );

    return fb;
  }

  addClosingPeriod() {
    let fb: FormGroup = this.formBuilder.group({
      date: ['', [Validators.required]],
    });
    let dates = this.fundForm.get('closingPeriods') as FormArray;
    dates.push(fb);
  }

  removeClosingPeriod(index: any) {
    let dirs = this.fundForm.get('closingPeriods') as FormArray;
    dirs.removeAt(index);
  }

  addDirector() {
    let fb: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      signature: [null, [Validators.required]],
    });
    let directors = this.fundForm.get('directorsList') as FormArray;
    directors.push(fb);
  }

  removeDirector(index: any) {
    let dirs = this.fundForm.get('directorsList') as FormArray;
    dirs.removeAt(index);
  }

  GetControls(name: string) {
    return (this.fundForm.get(name) as FormArray).controls;
  }

  addSubscriber() {
    let fb: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      commitment: [0.0, [Validators.required]],
    });
    let subscribers = this.fundForm.get('subscribers') as FormArray;
    subscribers.push(fb);
  }

  removeSubscriber(index: any) {
    let subs = this.fundForm.get('subscribers') as FormArray;
    subs.removeAt(index);
  }

  ParseDateFormatSingle(single:any) {
    let str = '';
    str = single.year.toString() + '-' + single.month.toString() + '-' + single.day.toString();
    return str; 
  }

  ParseDateFormatMultiple(arr: any) {
    let retArr: any = [];
    arr.map((result: any) => {
        if(result.date) retArr.push({date:result.date.year.toString() + '-' + result.date.month.toString() + '-' + result.date.day.toString()});
      });
    return retArr;
  }

  ParseDirectors(arr: any) {
    let retArr: any = [];
    arr.map((result: any) => {
      retArr.push(result.id.toString());
    });
    if (retArr.length == 1) retArr = retArr[0];
    return retArr;
  }

  MapIdFromName(name:any){
    return name[0].id.toString();
  }

  ParseSubscribersOrDirectorList(arr:any){
    arr.map((res:any)=>{
      res.name = this.MapIdFromName(res.name);
    });
    return arr;
  }

  Submit() {
    if (this.fundForm.get('closingPeriods')?.value && this.fundForm.get('closingPeriods')?.value.length && this.fundForm.get('closingPeriods')?.value[0].date != '') {
      let arr = this.ParseDateFormatMultiple(this.fundForm.get('closingPeriods')?.value);
      this.fundForm
        .get('closingPeriods')
        ?.setValue(
          arr
        );
    }
    if (this.fundForm.get('redeem')?.value) {
      this.fundForm
        .get('redeem')
        ?.setValue(this.ParseDateFormatSingle(this.fundForm.get('redeem')?.value));
    }

    if (this.fundForm.get('fundEndDate')?.value != null) { 
      console.log(this.fundForm.get('fundEndDate')?.value);
      this.fundForm
        .get('fundEndDate')
        ?.setValue(
          this.ParseDateFormatSingle(this.fundForm.get('fundEndDate')?.value)
        );
    }


    if (
      this.fundForm.get('approver')?.value &&
      this.fundForm.get('approver')?.value.length
    ) {
      this.fundForm
        .get('approver')
        ?.setValue(this.ParseDirectors(this.fundForm.get('approver')?.value));
    }

    if (
      this.fundForm.get('authorizedSignatory')?.value &&
      this.fundForm.get('authorizedSignatory')?.value.length
    ) {
      this.fundForm
        .get('authorizedSignatory')
        ?.setValue(this.ParseDirectors(this.fundForm.get('authorizedSignatory')?.value));
    }
    if (
      this.fundForm.get('fundAdmin')?.value &&
      this.fundForm.get('fundAdmin')?.value.length
    ) {
      this.fundForm
        .get('fundAdmin')
        ?.setValue(this.ParseDirectors(this.fundForm.get('fundAdmin')?.value));
    }
    if (
      this.fundForm.get('fundManagerRep')?.value &&
      this.fundForm.get('fundManagerRep')?.value.length
    ) {
      this.fundForm
        .get('fundManagerRep')
        ?.setValue(this.ParseDirectors(this.fundForm.get('fundManagerRep')?.value));
    }

    if (
      this.fundForm.get('fundManagerEntity')?.value &&
      this.fundForm.get('fundManagerEntity')?.value.length
    ) {
      this.fundForm
        .get('fundManagerEntity')
        ?.setValue(this.ParseDirectors(this.fundForm.get('fundManagerEntity')?.value));
    }

    if (
      this.fundForm.get('investmentComittee')?.value &&
      this.fundForm.get('investmentComittee')?.value.length
    ) {
      this.fundForm
        .get('investmentComittee')
        ?.setValue(this.ParseDirectors(this.fundForm.get('investmentComittee')?.value));
    }

    if (
      this.fundForm.get('preparer')?.value &&
      this.fundForm.get('preparer')?.value.length
    ) {
      this.fundForm
        .get('preparer')
        ?.setValue(this.ParseDirectors(this.fundForm.get('preparer')?.value));
    }

    if (  
      this.fundForm.get('subscribers')?.value &&
      this.fundForm.get('subscribers')?.value.length
    ) {
      this.fundForm.get('subscribers')?.setValue(this.ParseSubscribersOrDirectorList(this.fundForm.get('subscribers')?.value));
    }

    if (  
      this.fundForm.get('directorsList')?.value &&
      this.fundForm.get('directorsList')?.value.length
    ) {
      this.fundForm.get('directorsList')?.setValue(this.ParseSubscribersOrDirectorList(this.fundForm.get('directorsList')?.value));
    }
    
    let obj={
      
    }

    // if (this.fundForm && this.fundForm.valid) {
    //   this.fundForm.value.created_at = new Date().toISOString();
    //   this.fundForm.value.updated_at = null;
    //   this.apiService.onSave(this.fundForm.value).subscribe(
    //     (result: any) => {
    //       if (result.status == 'ok') {
    //         this._snackBar.open('Fund created successfully!', '', {
    //           horizontalPosition: this.horizontalPosition,
    //           verticalPosition: this.verticalPosition,
    //           duration: 4000,
    //         });
    //        this.fundForm.reset();
    //         this.router.navigate(['dashboard/funds/list']);
    //       }
    //     },
    //     (err: any) => {}
    //   );
    // }
  }

  Cancel() {
    Swal.fire({
      title: 'Confirmation!',
      text: 'Unsaved changes will be discarded, Do you want to continue?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (!result.isConfirmed) {
        this.router.navigate(['dashboard/funds/list']);
      } else {
        return;
      }
    });
  }
}
