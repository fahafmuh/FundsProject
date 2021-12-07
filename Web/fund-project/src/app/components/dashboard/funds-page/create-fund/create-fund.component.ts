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

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  fundForm: FormGroup;
  sectionNo = 1;
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
    { value: 'frozen', viewValue: 'Frozen/Unfrozen' },
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

  directors: any = [];
  file: File | null = null;

  constructor(
    private apiService: APIService,
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

  isNumberOnly(event:any) {
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
      fundStructure: ['open-end', []],
      offerPrice: [1.0, []],
      fundSize: [0.0, []],
      issuedShares: [1, []],
      ordinaryShare: [1, []],
      fundStatus: ['onboarding', []],
      reportingCurrency: ['USD', []],
      lockupPeriod: [0, []],
      fundYearEnd: ['Dec', []],
      productType: ['private-equity', []],
      fundLife: [null, [Validators.required]],
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
      directorsList: [this.TransformDirectors(), [Validators.required]],
      subscribers: this.formBuilder.array(this.TransformSubscribers()),
      // Section 3:
      authorizedSignatory: [[], [Validators.required]],
      signature: [null, [Validators.required]],
      boardResolutions: [null, [Validators.required]],
      fundAdmin: ['', [Validators.required]],
      GIIN: ['', [Validators.required,Validators.maxLength(50)]],
      preparer: ['', []],
      closingPeriod: [[], [Validators.required]],
      reclassificationFreq: ['month', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [0.0, []],
      managementFee: [0.0, []],
      hurdleRate: [0.0000, []],
      CTC: [0.00, []],
      bank: ['OCBC', []],
      bankAccount: ['', [Validators.required,Validators.maxLength(50)]],
      bankAccessId: ['', [Validators.required,Validators.maxLength(50)]],
      bankAccessPassword: ['', [Validators.required,Validators.maxLength(50)]],

      // Section 4:
      freeze: ['', []],
      freezeReason: ['', []],
      unfreeze: ['', []],
      unfreezeReason: ['', []],
      refund: [0.0, []],
      refundReason: ['', []],
      redeem: ['', []],
      redeemReason: ['', []],
      extend: ['', []],
      extendReason: ['', []],
      liquidate: ['', []],
      liquidateReason: ['', []],

      created_at: ['', []],
      updated_at: ['', []],
    });

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

    this.fundForm.get('fundStatus')!.valueChanges.subscribe((value) => {
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
    });

    this.fundForm.valueChanges.subscribe((val) => {
      if (val.fundSize && val.offerPrice) {
        const issuedShareValue = val.fundSize / val.offerPrice;
        this.fundForm.controls.issuedShares.patchValue(issuedShareValue, {
          emitEvent: false,
        });
      }
    });
  }

  refresh() {
    return (this.directors = [...this.directors]);
  }

  handleFileInput(field:string,event: any) {
    const formData: FormData = new FormData();
    let files = event.target.files[0];
    formData.append('file', files, files['name']);
    this.fundForm.get(field)?.setValue(formData);
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

  addDirector() {
    let fb: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      signature: [null, [Validators.required]],
    });
    let directors = this.fundForm.get('directors') as FormArray;
    directors.push(fb);
  }

  removeDirector(index: any) {
    let dirs = this.fundForm.get('directors') as FormArray;
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

  Submit() {
    console.log(this.fundForm.value);

    if (this.fundForm && this.fundForm.valid) {
      this.fundForm.value.created_at = new Date().toISOString();
      this.fundForm.value.updated_at = null;
      this.apiService.onSave(this.fundForm.value).subscribe(
        (result: any) => {
          if (result.status == 'ok') {
            this._snackBar.open('Fund created successfully!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
            this.router.navigate(['dashboard/funds/list']);
          }
        },
        (err: any) => {}
      );
    }
  }

  Cancel() {
    Swal.fire({
      title: 'Confirmation!',
      text: 'Unsaved changes will be discarded, Do you want to continue?',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['dashboard/funds/list']);
      } else {
        return;
      }
    });
  }
}
