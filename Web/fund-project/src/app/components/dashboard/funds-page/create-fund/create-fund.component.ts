import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  fundForm: FormGroup | undefined;
  active = 1;
  items: any;

  constructor(
    private apiService: APIService,
    private toastService:ToastService,
    private formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    // Section 1:
    this.fundForm = this.formBuilder.group({
      fundName: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      fundDescription: ['', [Validators.required]],
      subFund: ['', []],
      domicile: ['Singapore', []],
      fundType: ['', []],
      fundManagerEntity: ['', [Validators.required]],
      fundManagerRep: ['', [Validators.required]],
      fundStructure: ['', []],
      offerPrice: [null, []],
      issuedShares: [null, []],
      ordinaryShare: [null, []],
      fundStatus: [null, []],
      reportingCurrency: [null, []],
      fundSize: [null, []],
      lookupPeriod: [null, []],
      fundYearEnd: [null, []],
      productType: [null, []],
      fundLife: [null, [Validators.required]],
      fundEndDate: [null, []],
      catchUp: [null, []],

      // Section 2:
      reportingFrequency: ['', []],
      legalCounsel: ['', [Validators.required]],
      legalCounselRep: ['', [Validators.required]],
      auditor: ['', [Validators.required]],
      auditorRep: ['', [Validators.required]],
      trustee: ['', [Validators.required]],
      trusteeRep: ['', [Validators.required]],
      investmentComittee: [new FormArray([]), [Validators.required]],
      AUM: ['', [Validators.required]],
      directors: [new FormArray([]), [Validators.required]],
      directorSignature: ['', [Validators.required]],
      subscribers: [new FormArray([]), [Validators.required]],
      subscribersCommitment: [
        this.formBuilder.array([]),
        [Validators.required],
      ],

      // Section 3:
      authorizedSignatory: [[], [Validators.required]],
      signature: [null, [Validators.required]],
      boardResolutions: [null, [Validators.required]],
      fundAdmin: ['', [Validators.required]],
      GIIN: ['', [Validators.required]],
      preparer: ['', []],
      closingPeriod: [[], [Validators.required]],
      reclassificationFreq: ['', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [null, []],
      managementFee: [null, []],
      hurdleRate: [null, []],
      CTC: [null, []],
      bank: ['', []],
      bankAccount: ['', [Validators.required]],
      bankAccessId: ['', [Validators.required]],
      bankAccessPassword: ['', [Validators.required]],

      // Section 4:
      freeze: ['', []],
      freezeReason: ['', []],
      unfreeze: ['', []],
      unfreezeReason: ['', []],
      refund: ['', []],
      refundReason: ['', []],
      redeem: ['', []],
      redeemReason: ['', []],
      extend: ['', []],
      extendReason: ['', []],
      liquidate: ['', []],
      liquidateReason: ['', []],
    });
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
    if (this.fundForm && this.fundForm.valid) {
      this.apiService.onSave(this.fundForm.value).subscribe(
        (result: any) => {
          if (result.status == 'ok') {
            this.toastService.show('Fund created successfully!', { classname: 'bg-success text-light', delay: 4500 });
            this.apiService.isCreatedForm.next(false);
          }
        },
        (err: any) => {}
      );
    }
  }

  Cancel() {
    this.apiService.isCreatedForm.next(false);
  }
}
