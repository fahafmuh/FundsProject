import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, max, startWith } from 'rxjs/operators';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  fundForm: FormGroup;
  @ViewChild('directorInput') directorInput: ElementRef<HTMLInputElement>;
  filteredFruits: Observable<string[]>;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  sectionNo = 1;
  items: any;
  today = new Date();
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  noNeed = false;
  disable = true;
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
        } else {
          this.directors = [];
        }
      },
      (err) => {
        this.directors = [];
      }
    );
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
      investmentComittee: [new FormArray([]), [Validators.required]],
      directors: [new FormArray([]), [Validators.required]],
      directorSignature: ['', [Validators.required]],
      subscribers: [new FormArray([]), [Validators.required]],
      subscribersCommitment: [0.0, [Validators.required]],

      // Section 3:
      authorizedSignatory: [[], [Validators.required]],
      signature: [null, [Validators.required]],
      boardResolutions: [null, [Validators.required]],
      fundAdmin: ['', [Validators.required]],
      GIIN: ['', [Validators.required]],
      preparer: ['', []],
      closingPeriod: [[], [Validators.required]],
      reclassificationFreq: ['month', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [0.0, []],
      managementFee: [0.0, []],
      hurdleRate: [0.0, []],
      CTC: [0.0, []],
      bank: ['ocbc', []],
      bankAccount: ['', [Validators.required]],
      bankAccessId: ['', [Validators.required]],
      bankAccessPassword: ['', [Validators.required]],

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

    this.filteredFruits = this.fundForm.valueChanges.pipe(
      startWith(null),
      map((director: string | null) =>
        director ? this._filter(director) : this.directors.slice()
      )
    );

    this.fundForm.valueChanges.subscribe((val) => {
      if (val.fundSize && val.offerPrice) {
        const issuedShareValue = val.fundSize / val.offerPrice;
        this.fundForm.controls.issuedShares.patchValue(issuedShareValue, {
          emitEvent: false,
        });
      }
    });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.directors.map((res: any, index: any) => {
        if (res.name != value) {
          this.apiService.addDirector(value).subscribe(
            (result: any) => {
              if (result.status == 'ok') {
                this.directors.push(value);
                this.refresh();
              } else {
                this.refresh();
              }
            },
            (err: any) => {
              this.refresh();
            }
          );
        }
      });
    }


  

    // Clear the input value
    // event.chipInput!.clear();

    // this.fruitCtrl.setValue(null);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.directors.push(event.option.viewValue);
    this.directorInput.nativeElement.value = '';
  }

  refresh(){
    return this.directors = [...this.directors];
  }

  remove(value: string): void {
    const index = this.directors.indexOf(value);

    if (index >= 0) {
      this.apiService.deleteDirector(value).subscribe((res:any)=>{
        if(res.status == "ok"){
          this.directors.splice(index, 1);
          this.refresh();
        }else{
          this.refresh();
        }
      },err=>{
        this.refresh();
      })
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.directors.filter((director: any) =>
      director.toLowerCase().includes(filterValue)
    );
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  addItem(name: string) {
    if (this.fundForm) {
      this.items = this.fundForm.get(name) as FormArray;
      this.items.push(this.createItem());
    }
  }

  deleteItem(index: number, name: string) {
    if (this.fundForm) {
      const remove = this.fundForm.get(name) as FormArray;
      remove.removeAt(index);
    }
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
