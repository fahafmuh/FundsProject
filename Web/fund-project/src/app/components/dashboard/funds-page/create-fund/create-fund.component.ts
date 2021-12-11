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
  isSimpleOptionSF = false;
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
          console.log(this.directors);
          
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

  checkDeleteAvailibility(name: string, subfund = false) {
    let bool = false;
    if (subfund) {
      bool =
        (
          (this.fundForm.get('subFundData') as FormGroup).controls[
            name
          ] as FormArray
        ).value.length > 1;
    } else {
      bool = this.fundForm.get(name)?.value.length > 1;
    }
    return bool;
  }

  checkAddAvailibility(name: string, index: number, subfund = false) {
    let bool = false;
    if (subfund) {
      bool =
        index ==
        (
          (this.fundForm.get('subFundData') as FormGroup).controls[
            name
          ] as FormArray
        ).value.length -
          1
          ? true
          : false;
    } else {
      bool = index == this.fundForm.get(name)?.value.length - 1 ? true : false;
    }
    return bool;
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

  TransformSubfundData(): FormGroup {
    return this.formBuilder.group({
      S_fundName: ['', []],
      S_registrationNumber: [null, []],
      S_fundDescription: [null, []],
      S_domicile: ['singapore', []],
      S_fundType: ['regulated', []],
      S_fundManagerEntity: [null, []],
      S_fundManagerRep: [null, []],
      S_fundStructure: ['open-ended', []],
      S_offerPrice: [1.0, []],
      S_fundSize: [0.0, []],
      S_issuedShares: [1, []],
      S_ordinaryShare: [1, []],
      S_fundStatus: ['onboarding', []],
      S_fundStatusReason: ['', []],
      S_reportingCurrency: ['USD', []],
      S_lockupPeriod: [0, []],
      S_fundYearEnd: ['Dec', []],
      S_productType: ['private-equity', []],
      S_fundLifeYears: [null, []],
      S_boardExtension: [null, []],
      S_investorExtension: [null, []],
      S_fundLifedocuments: [null, []],
      S_fundEndDate: [null, []],
      S_catchup: [0.0, []],
      S_reportingFrequency: ['month', []],
      S_legalCounsel: ['', []],
      S_legalCounselRep: ['', []],
      S_auditor: ['', []],
      S_auditorRep: ['', []],
      S_trustee: ['', []],
      S_trusteeRep: ['', []],
      S_investmentComittee: [[], []],
      S_directorsList: this.formBuilder.array(this.TransformDirectors()),
      S_subscribers: this.formBuilder.array(this.TransformSubscribers()),
      S_authorizedSignatory: [[], []],
      S_signature: [null, []],
      S_boardResolutions: [null, []],
      S_fundAdmin: ['', []],
      S_GIIN: ['', []],
      S_preparer: ['', []],
      S_closingPeriods: this.formBuilder.array(this.TransformClosingPeriods()),
      S_reclassificationFreq: ['month', []],
      S_approver: ['', []],
      S_subscriptionAgreement: [null, []],
      S_investmentAgreement: [null, []],
      S_PPM: [null, []],
      S_directorFee: [0.0, []],
      S_managementFee: [0.0, []],
      S_hurdleRate: [0.0, []],
      S_CTC: [0.0, []],
      S_bank: ['OCBC', []],
      S_bankAccount: ['', []],
      S_bankAccessId: ['', []],
      S_bankAccessPassword: ['', []],
      S_redeem: ['', []],
      S_redeemReason: ['', []],
      S_liquidate: ['', []],
      S_liquidateReason: ['', []],
    });
  }

  ngOnInit(): void {
    // Section 1:
    this.fundForm = this.formBuilder.group({
      fundName: ['', [Validators.required, Validators.maxLength(256)]],
      registrationNumber: [
        null,
        [Validators.required, Validators.maxLength(50)],
      ],
      fundDescription: [
        null,
        [Validators.required, Validators.maxLength(2048)],
      ],
      subFund: ['N', []],
      subFundData: this.TransformSubfundData(),
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

      if (
        val.subscribers &&
        val.subscribers.length &&
        this.fundForm.get('fundSize')?.value
      ) {
        let sum: number = 0;
        val.subscribers.map((amount: any) => {
          sum = sum + amount.commitment;
          if (sum <= this.fundForm.get('fundSize')?.value) {
            this.globalDisable = true;
          } else {
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

  StructureChangeSubFund(event: any) {
    let value = event.target.value;
    if (value == 'close-ended') {
      this.isSimpleOptionSF = true;
    } else {
      this.isSimpleOptionSF = false;
    }
  }

  handleFileInput(name: string, event: any,subfund = false) {
    const formData: FormData = new FormData();
    let file = event.target.files[0];
    formData.append(name, file, file['name']);
    if(subfund){
      (this.fundForm.get('subFundData') as FormGroup).controls[name].setValue(formData)
    }
    else{
      this.fundForm.get(name)?.setValue(formData);
    }
    file = undefined;
  }

  getIdByDirectorName(name: string) {
    let id: any;
    this.directors.map((res: any) => {
      if (name == res.director_name){
        id = res.id;
      } 
    });
    return id;
  }

  handleFileInputDirector(index: number, event: any, subfund = false) {
    if (subfund) {
      let control = (
        (this.fundForm.get('subFundData') as FormGroup).controls[
          'S_directorsList'
        ] as FormArray
      )?.value[index];

      const formData: FormData = new FormData();
      let file = event.target.files[0];
      let id = this.getIdByDirectorName(control.value.name);
      formData.append('director' + id, file);
      control.signature = formData;
      file = undefined;
    } else {
      let control = this.fundForm.get('directorsList')?.value[index];
      const formData: FormData = new FormData();
      let file = event.target.files[0];
      let id = this.getIdByDirectorName(control.value.name);
      formData.append('director' + id, file);
      control.signature = formData;
      file = undefined;
    }
  }

  handleFileMultipleInput(name: string, event: any,subfund = false) {
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      formData.append(name, event.target.files[i]);
      if (i == event.target.files.length - 1) {
        if(subfund){
          (this.fundForm.get('subFundData') as FormGroup).controls[name].setValue(formData)
        }else{
          this.fundForm.get(name)?.setValue(formData);
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

  addClosingPeriod(subfund = false) {
    let fb: FormGroup = this.formBuilder.group({
      date: ['', [Validators.required]],
    });
    if (subfund) {
      let subDates = (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_closingPeriods'
      ] as FormArray;
      subDates.push(fb);
    } else {
      let dates = this.fundForm.get('closingPeriods') as FormArray;
      dates.push(fb);
    }
  }

  removeClosingPeriod(index: any, subfund = false) {
    if (subfund) {
      let subDates = (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_closingPeriods'
      ] as FormArray;
      subDates.removeAt(index);
    } else {
      let dirs = this.fundForm.get('closingPeriods') as FormArray;
      dirs.removeAt(index);
    }
  }

  addDirector(subfund = false) {
    let fb: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      signature: [null, [Validators.required]],
    });
    if (subfund) {
      let subDates = (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_directorsList'
      ] as FormArray;
      subDates.push(fb);
    } else {
      let directors = this.fundForm.get('directorsList') as FormArray;
      directors.push(fb);
    }
  }

  removeDirector(index: any, subfund = false) {
    if (subfund) {
      (
        (this.fundForm.get('subFundData') as FormGroup).controls[
          'S_directorsList'
        ] as FormArray
      ).removeAt(index);
    } else {
      let dirs = this.fundForm.get('directorsList') as FormArray;
      dirs.removeAt(index);
    }
  }

  GetControls(name: string) {
    return (this.fundForm.get(name) as FormArray).controls;
  }

  GetControlsSubFund(name: string) {
    return (
      (this.fundForm.get('subFundData') as FormGroup).controls[
        name
      ] as FormArray
    ).controls;
  }

  addSubscriber(subfund = false) {
    let fb: FormGroup = this.formBuilder.group({
      name: ['', [Validators.required]],
      commitment: [0.0, [Validators.required]],
    });
    if(subfund){
      let subDates = (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_subscribers'
      ] as FormArray;
      subDates.push(fb);
    }
    else{
      let subscribers = this.fundForm.get('subscribers') as FormArray;
      subscribers.push(fb);
    }
  }

  removeSubscriber(index: any,subfund = false) {
    if(subfund){
      ((this.fundForm.get('subFundData') as FormGroup).controls[
        'S_subscribers'
      ] as FormArray).removeAt(index);
    }else{
      let subs = this.fundForm.get('subscribers') as FormArray;
      subs.removeAt(index);
    }
  }

  ParseDateFormatSingle(single: any) {
    let str = '';
    str =
      single.year.toString() +
      '-' +
      single.month.toString() +
      '-' +
      single.day.toString();
    return str;
  }

  ParseDateFormatMultiple(arr: any) {
    let retArr: any = [];
    arr.map((result: any) => {
      if (result.date)
        retArr.push({
          date:
            result.date.year.toString() +
            '-' +
            result.date.month.toString() +
            '-' +
            result.date.day.toString(),
        });
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

  MapIdFromName(name: any) {
    return name[0].id.toString();
  }

  ParseSubscribersOrDirectorList(arr: any) {
    arr.map((res: any) => {
      res.name = this.MapIdFromName(res.name);
    });
    return arr;
  }

  Submit() {
    console.log(this.fundForm.value);

    if (this.fundForm.get('subFund')?.value == 'Y') {
      console.log(this.fundForm.get('subFundData')?.value.value);
      this.fundForm
        .get('subFundData')
        ?.setValue(this.fundForm.get('subFundData')?.value.value);
    } else {
      this.fundForm.get('subFundData')?.setValue(undefined);
    }
    console.log(this.fundForm.value);

    if (
      this.fundForm.get('closingPeriods')?.value &&
      this.fundForm.get('closingPeriods')?.value.length &&
      this.fundForm.get('closingPeriods')?.value[0].date != ''
    ) {
      let arr = this.ParseDateFormatMultiple(
        this.fundForm.get('closingPeriods')?.value
      );
      this.fundForm.get('closingPeriods')?.setValue(arr);
    }
    if (this.fundForm.get('redeem')?.value) {
      this.fundForm
        .get('redeem')
        ?.setValue(
          this.ParseDateFormatSingle(this.fundForm.get('redeem')?.value)
        );
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
        ?.setValue(
          this.ParseDirectors(this.fundForm.get('authorizedSignatory')?.value)
        );
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
        ?.setValue(
          this.ParseDirectors(this.fundForm.get('fundManagerRep')?.value)
        );
    }

    if (
      this.fundForm.get('fundManagerEntity')?.value &&
      this.fundForm.get('fundManagerEntity')?.value.length
    ) {
      this.fundForm
        .get('fundManagerEntity')
        ?.setValue(
          this.ParseDirectors(this.fundForm.get('fundManagerEntity')?.value)
        );
    }

    if (
      this.fundForm.get('investmentComittee')?.value &&
      this.fundForm.get('investmentComittee')?.value.length
    ) {
      this.fundForm
        .get('investmentComittee')
        ?.setValue(
          this.ParseDirectors(this.fundForm.get('investmentComittee')?.value)
        );
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
      this.fundForm
        .get('subscribers')
        ?.setValue(
          this.ParseSubscribersOrDirectorList(
            this.fundForm.get('subscribers')?.value
          )
        );
    }

    if (
      this.fundForm.get('directorsList')?.value &&
      this.fundForm.get('directorsList')?.value.length
    ) {
      this.fundForm
        .get('directorsList')
        ?.setValue(
          this.ParseSubscribersOrDirectorList(
            this.fundForm.get('directorsList')?.value
          )
        );
    }

    let obj = {};

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
