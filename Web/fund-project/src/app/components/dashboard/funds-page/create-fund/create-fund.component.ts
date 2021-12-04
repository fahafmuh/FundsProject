import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import { ToastService } from 'src/app/services/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/dialogs/confirmation-dialog/confirmation-dialog.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit {
  fundForm: FormGroup | undefined;
  active = 1;
  items: any;

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  constructor(
    private apiService: APIService,
    private _snackBar: MatSnackBar,
    private dialogRef: MatDialog,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    // Section 1:
    this.fundForm = this.formBuilder.group({
      fundName: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      fundDescription: ['', [Validators.required]],
      subFund: ['', []],
      domicile: ['Singapore', []],
      fundType: ['regulated', []],
      fundManagerEntity: ['', [Validators.required]],
      fundManagerRep: ['', [Validators.required]],
      fundStructure: ['open-ended', []],
      offerPrice: [1.00, []],
      issuedShares: [1, []],
      ordinaryShare: [1, []],
      fundStatus: ['onboarding', []],
      reportingCurrency: ['USD', []],
      fundSize: [0.00, []],
      lookupPeriod: [0, []],
      fundYearEnd: ['Dec', []],
      productType: ['private-equity', []],
      fundLife: [null, [Validators.required]],
      fundEndDate: [null, []],
      catchUp: [0.00, []],

      // Section 2:
      reportingFrequency: ['month', []],
      legalCounsel: ['', [Validators.required]],
      legalCounselRep: ['', [Validators.required]],
      auditor: ['', [Validators.required]],
      auditorRep: ['', [Validators.required]],
      trustee: ['', [Validators.required]],
      trusteeRep: ['', [Validators.required]],
      investmentComittee: [new FormArray([]), [Validators.required]],
      AUM: [0.00, [Validators.required]],
      directors: [new FormArray([]), [Validators.required]],
      directorSignature: ['', [Validators.required]],
      subscribers: [new FormArray([]), [Validators.required]],
      subscribersCommitment: [
        0.00,
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
      reclassificationFreq: ['month', []],
      approver: ['', [Validators.required]],
      subscriptionAgreement: [null, [Validators.required]],
      investmentAgreement: [null, [Validators.required]],
      PPM: [null, [Validators.required]],
      directorFee: [0.00, []],
      managementFee: [0.00, []],
      hurdleRate: [0.0000, []],
      CTC: [0.00, []],
      bank: ['ocbc', []],
      bankAccount: ['', [Validators.required]],
      bankAccessId: ['', [Validators.required]],
      bankAccessPassword: ['', [Validators.required]],

      // Section 4:
      freeze: ['', []],
      freezeReason: ['', []],
      unfreeze: ['', []],
      unfreezeReason: ['', []],
      refund: [0.00, []],
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
            this._snackBar.open('Fund created successfully!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
            });
            this.apiService.isCreatedForm.next(false);
          }
        },
        (err: any) => {}
      );
    }
  }

  Cancel() {
    this.dialogRef.open(ConfirmationDialogComponent, {
      data: {
        text: 'You have unsaved changes, are you sure want to leave this page?',
        okButtonLabel: 'Yes',
        cancelButtonLable: 'Cancel',
      },
    });
    this.apiService.isCreatedForm.next(false);
  }
}
