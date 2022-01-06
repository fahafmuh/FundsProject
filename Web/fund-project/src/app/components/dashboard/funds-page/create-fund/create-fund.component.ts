import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { APIService } from 'src/app/services/api.service';
import Swal from 'sweetalert2';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';

@Component({
  selector: 'app-create-fund',
  templateUrl: './create-fund.component.html',
  styleUrls: ['./create-fund.component.scss'],
})
export class CreateFundComponent implements OnInit, OnDestroy {
  fundForm: FormGroup;
  showInvalidControls: any = [];
  sectionNo = 0;
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
  globalDisableSF = false;
  isDropdownDisabledSF = false;

  maxNumberOfTabs = 4;
  directors: any = [];
  selectedFund: any = undefined;
  constructor(
    private config: NgbDatepickerConfig,
    private apiService: APIService,
    private _snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    private router: Router,
    private route: ActivatedRoute,
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

  MapArrayDirector(arr: any) {
    let final: any = [];
    arr.map((res: any) => {
      final.push(res.director_name);
    });
    return final;
  }

  MapDate(date: any) {
    let splitCreatedDate = date.split('-', 3);
    let apiYear = Number(splitCreatedDate[0]);
    let apiMonth = Number(splitCreatedDate[1]);
    let apiDay = Number(splitCreatedDate[2]);
    return { year: apiYear, month: apiMonth, day: apiDay };
  }

  MapDirectors(directors: any, controlsForm: FormArray) {
    for (const c of directors) {
      let fb: FormGroup = this.formBuilder.group({
        name: [[c.director_name], [Validators.required]],
        signature: [c.director_signature, [Validators.required]],
      });
      if (controlsForm) controlsForm.push(fb);
    }
    if (controlsForm) controlsForm.removeAt(0);
  }

  MapSubs(persons: any, controlsForm: FormArray) {
    for (const c of persons) {
      let fb: FormGroup = this.formBuilder.group({
        name: [[c.subscriber_name], [Validators.required]],
        commitment: [c.subscriber_commitment, [Validators.required]],
      });
      controlsForm.push(fb);
    }
    if (controlsForm) controlsForm.removeAt(0);
  }

  MapClosingDates(dates: any, controlsForm: FormArray) {
    for (const c of dates) {
      let fb: FormGroup = this.formBuilder.group({
        date: [this.MapDate(c.closing_Date), [Validators.required]],
      });
      if (controlsForm) controlsForm.push(fb);
    }
    if (controlsForm) controlsForm.removeAt(0);
  }

  getFileName(data: any) {
    let str = '';
    if (Array.isArray(data)) data = data[0];
    if (data && typeof data == 'string') {
      str = data.split('/')[3];
    }
    return str;
  }

  checkType(field: any) {
    return field instanceof FormData ? true : false;
  }

  MapFiles(files: any) {
    let data: any = Array.isArray(files) ? files : [];
    if (data && data.length) {
      data.length.map((file: any) => {});
    }
  }

  MapValues(fundValue: any) {
    console.log(fundValue);
    this.fundForm.get('fundName')?.patchValue(fundValue.fund_name);
    this.fundForm
      .get('registrationNumber')
      ?.patchValue(fundValue.registration_no);
    this.fundForm
      .get('fundDescription')
      ?.patchValue(fundValue.fund_description);
    this.fundForm
      .get('fundManagerEntity')
      ?.patchValue(fundValue.fund_manager_entity);
    this.fundForm
      .get('fundManagerRep')
      ?.patchValue([fundValue.fund_manager_rep['director_name']]);
    this.fundForm
      .get('investmentComittee')
      ?.patchValue(this.MapArrayDirector(fundValue.investment_committee));
    this.fundForm
      .get('authorizedSignatory')
      ?.patchValue([fundValue.AuthorizedSignatory['director_name']]);
    this.fundForm
      .get('approver')
      ?.patchValue([fundValue.Approver['director_name']]);
    this.fundForm
      .get('domicile')
      ?.patchValue(fundValue.domicile ? fundValue.domicile.country_name : '');
    this.fundForm.get('offerPrice')?.patchValue(fundValue.offer_price);
    this.fundForm.get('issuedShares')?.patchValue(fundValue.issued_shares);
    this.fundForm.get('ordinaryShares')?.patchValue(fundValue.ordinary_shares);
    this.fundForm.get('fundSize')?.patchValue(fundValue.fund_size);
    this.fundForm.get('lockupPeriod')?.patchValue(fundValue.lock_up_period);
    this.fundForm.get('fundYearEnd')?.patchValue(fundValue.fund_year_end);
    this.fundForm
      .get('fundEndDate')
      ?.patchValue(
        fundValue.fund_end_date ? this.MapDate(fundValue.fund_end_date) : ''
      );
    this.fundForm.get('catchUp')?.patchValue(Number(fundValue.catch_up));
    this.fundForm.get('legalCounsel')?.patchValue(fundValue.legal_counsel);
    this.fundForm
      .get('legalCounselRep')
      ?.patchValue(fundValue.legal_counsel_rep);
    this.fundForm.get('auditor')?.patchValue(fundValue.Auditor);
    this.fundForm.get('auditorRep')?.patchValue(fundValue.Auditor_rep);
    this.fundForm.get('trustee')?.patchValue(fundValue.Custodian);
    this.fundForm.get('trusteeRep')?.patchValue(fundValue.Custodian_rep);
    this.fundForm.get('fundAdmin')?.patchValue(fundValue.FundAdministrator);
    this.fundForm.get('GIIN')?.patchValue(fundValue.GIIN);
    this.fundForm.get('directorFee')?.patchValue(fundValue.Director_Fees);
    this.fundForm.get('managementFee')?.patchValue(fundValue.Management_Fee);
    this.fundForm.get('hurdleRate')?.patchValue(fundValue.Hurdle_Rate);
    this.fundForm.get('CTC')?.patchValue(fundValue.CTC);
    this.fundForm.get('GIIN')?.patchValue(fundValue.GIIN);
    this.fundForm.get('bank')?.patchValue(fundValue.Bank.Bank_name);
    this.fundForm.get('bankAccount')?.patchValue(fundValue.BankAccount);
    this.fundForm.get('bankAccessId')?.patchValue(fundValue.BankAccessID);
    this.fundForm
      .get('bankAccessPassword')
      ?.patchValue(fundValue.BankAccessPassword);
    this.fundForm
      .get('redeem')
      ?.patchValue(fundValue.redeem ? this.MapDate(fundValue.redeem) : '');
    this.fundForm.get('redeemReason')?.patchValue(fundValue.redeemReason);
    this.fundForm.get('liquidate')?.patchValue(fundValue.liquidate);
    this.fundForm.get('liquidateReason')?.patchValue(fundValue.liquidateReason);
    this.fundForm.get('fundStructure')?.patchValue(fundValue.fund_structure);
    this.fundForm.get('fundStatus')?.patchValue(fundValue.fund_status);
    this.fundForm
      .get('reportingFrequency')
      ?.patchValue(
        fundValue.reporting_frequency == null
          ? ''
          : fundValue.reporting_frequency.reporting_frequency_name
      );
    this.fundForm
      .get('reclassificationFrequency')
      ?.patchValue(
        fundValue.ReclassificationFrequency.reclassification_frequency_name
      );
    this.fundForm
      .get('productType')
      ?.patchValue(
        fundValue.product_type != null
          ? fundValue.product_type.product_type_name
          : ''
      );
    this.fundForm
      .get('reportingCurrency')
      ?.patchValue(fundValue.report_currency.currency);
    this.fundForm.get('preparer')?.patchValue(fundValue.Preparer);
    this.fundForm.get('created_at')?.patchValue(fundValue.created_at);
    this.fundForm.get('updated_at')?.patchValue(fundValue.updated_at);
    this.fundForm
      .get('subFund')
      ?.patchValue(fundValue.sub_fund != null ? 'Y' : 'N');
    this.MapClosingDates(
      fundValue.closingDates,
      this.fundForm.get('closingPeriods') as FormArray
    );
    this.MapDirectors(
      fundValue.directors,
      this.fundForm.get('directorsList') as FormArray
    );
    this.MapSubs(
      fundValue.subscribers,
      this.fundForm.get('subscribers') as FormArray
    );

    this.fundForm
      .get('investmentAgreement')
      ?.patchValue(fundValue.Investment_Agreement);
    this.fundForm
      .get('signature')
      ?.patchValue(fundValue.AuthorizedSignatory.director_signature);
    this.fundForm
      .get('subscriptionAgreement')
      ?.patchValue(fundValue.Subscription_Agreement);
    this.fundForm
      .get('boardResolutions')
      ?.patchValue(fundValue.boardResolution);
    this.fundForm
      .get('fundStatusReason')
      ?.patchValue(fundValue.reason_to_change);
    this.fundForm.get('PPM')?.patchValue(fundValue.PPM);
    if (fundValue.fund_structure == 'close-ended') {
      this.isSimpleOption = true;
      this.fundForm
        .get('fundLifeYears')
        ?.patchValue(fundValue.fundlifeclose.fundlife);
    } else {
      this.isSimpleOption = false;
      this.fundForm
        .get('fundLifeYears')
        ?.patchValue(fundValue.fundlifeopen.fundlife);
      this.fundForm
        .get('investorExtension')
        ?.patchValue(fundValue.fundlifeopen.Investor_Extension);
      this.fundForm
        .get('boardExtension')
        ?.patchValue(fundValue.fundlifeopen.Board_Extension);
      this.fundForm
        .get('fundLifedocuments')
        ?.patchValue(fundValue.fundlifeopen.fundlifeopendoc);
    }

    if (fundValue.sub_fund != null) {
      this.fundForm
        .get('subFundData.S_fundName')
        ?.patchValue(fundValue.sub_fund.fund_name);
      this.MapClosingDates(
        fundValue.sub_fund.closingDates,
        this.fundForm.get('subFundData.S_closingPeriods') as FormArray
      );
      this.MapDirectors(
        fundValue.sub_fund.directors,
        this.fundForm.get('subFundData.S_directorsList') as FormArray
      );
      this.MapSubs(
        fundValue.sub_fund.subscribers,
        this.fundForm.get('subFundData.S_subscribers') as FormArray
      );
      this.fundForm
        .get('subFundData.S_registrationNumber')
        ?.patchValue(fundValue.sub_fund.registration_no);
      this.fundForm
        .get('subFundData.S_fundDescription')
        ?.patchValue(fundValue.sub_fund.fund_description);
      this.fundForm
        .get('subFundData.S_fundManagerEntity')
        ?.patchValue(fundValue.sub_fund.fund_manager_entity);
      this.fundForm
        .get('subFundData.S_fundManagerRep')
        ?.patchValue([fundValue.sub_fund.fund_manager_rep['director_name']]);
      this.fundForm
        .get('subFundData.S_investmentComittee')
        ?.patchValue(
          this.MapArrayDirector(fundValue.sub_fund.investment_committee)
        );
      this.fundForm
        .get('subFundData.S_authorizedSignatory')
        ?.patchValue([fundValue.sub_fund.AuthorizedSignatory['director_name']]);
      this.fundForm
        .get('subFundData.S_approver')
        ?.patchValue([fundValue.sub_fund.Approver['director_name']]);
      this.fundForm
        .get('subFundData.S_domicile')
        ?.patchValue(fundValue.sub_fund.domicile.country_name);
      this.fundForm
        .get('signature')
        ?.patchValue(fundValue.AuthorizedSignatory.director_signature);
      this.fundForm
        .get('subFundData.S_signature')
        ?.patchValue(fundValue.sub_fund.AuthorizedSignatory.director_signature);

      this.fundForm
        .get('subFundData.S_offerPrice')
        ?.patchValue(fundValue.sub_fund.offer_price);
      this.fundForm
        .get('subFundData.S_issuedShares')
        ?.patchValue(fundValue.sub_fund.issued_shares);
      this.fundForm
        .get('subFundData.S_ordinaryShares')
        ?.patchValue(fundValue.sub_fund.ordinary_shares);
      this.fundForm
        .get('subFundData.S_fundSize')
        ?.patchValue(fundValue.sub_fund.fund_size);
      this.fundForm
        .get('subFundData.S_lockupPeriod')
        ?.patchValue(fundValue.sub_fund.lock_up_period);
      this.fundForm
        .get('subFundData.S_fundYearEnd')
        ?.patchValue(fundValue.sub_fund.fund_year_end);
      this.fundForm
        .get('subFundData.S_fundEndDate')
        ?.patchValue(
          fundValue.sub_fund.fund_end_date
            ? this.MapDate(fundValue.sub_fund.fund_end_date)
            : ''
        );
      this.fundForm
        .get('subFundData.S_catchUp')
        ?.patchValue(fundValue.sub_fund.catch_up);
      this.fundForm
        .get('subFundData.S_legalCounsel')
        ?.patchValue(fundValue.sub_fund.legal_counsel);
      this.fundForm
        .get('subFundData.S_legalCounselRep')
        ?.patchValue(fundValue.sub_fund.legal_counsel_rep);
      this.fundForm
        .get('subFundData.S_auditor')
        ?.patchValue(fundValue.sub_fund.Auditor);
      this.fundForm
        .get('subFundData.S_auditorRep')
        ?.patchValue(fundValue.sub_fund.Auditor_rep);
      this.fundForm
        .get('subFundData.S_trustee')
        ?.patchValue(fundValue.sub_fund.Custodian);
      this.fundForm
        .get('subFundData.S_trusteeRep')
        ?.patchValue(fundValue.sub_fund.Custodian_rep);
      this.fundForm
        .get('subFundData.S_fundAdmin')
        ?.patchValue(fundValue.sub_fund.FundAdministrator);
      this.fundForm
        .get('subFundData.S_GIIN')
        ?.patchValue(fundValue.sub_fund.GIIN);
      this.fundForm
        .get('subFundData.S_directorFee')
        ?.patchValue(fundValue.sub_fund.Director_Fees);
      this.fundForm
        .get('subFundData.S_managementFee')
        ?.patchValue(fundValue.sub_fund.Management_Fee);
      this.fundForm
        .get('subFundData.S_hurdleRate')
        ?.patchValue(fundValue.sub_fund.Hurdle_Rate);
      this.fundForm
        .get('subFundData.S_CTC')
        ?.patchValue(fundValue.sub_fund.CTC);
      this.fundForm
        .get('subFundData.S_bank')
        ?.patchValue(fundValue.sub_fund.Bank.Bank_name);
      this.fundForm
        .get('subFundData.S_bankAccount')
        ?.patchValue(fundValue.sub_fund.BankAccount);
      this.fundForm
        .get('subFundData.S_bankAccessId')
        ?.patchValue(fundValue.sub_fund.BankAccessID);
      this.fundForm
        .get('subFundData.S_BankAccessPassword')
        ?.patchValue(fundValue.sub_fund.BankAccessPassword);
      this.fundForm
        .get('subFundData.S_redeem')
        ?.patchValue(
          fundValue.sub_fund.redeem
            ? this.MapDate(fundValue.sub_fund.redeem)
            : ''
        );
      this.fundForm
        .get('subFundData.S_redeemReason')
        ?.patchValue(fundValue.sub_fund.redeemReason);
      this.fundForm
        .get('subFundData.S_liquidate')
        ?.patchValue(fundValue.sub_fund.liquidate);
      this.fundForm
        .get('subFundData.S_liquidateReason')
        ?.patchValue(fundValue.liquidateReason);
      this.fundForm
        .get('subFundData.S_fundStructure')
        ?.patchValue(fundValue.sub_fund.fund_structure);
      this.fundForm
        .get('subFundData.S_fundStatus')
        ?.patchValue(fundValue.sub_fund.fund_status);
      this.fundForm
        .get('subFundData.S_reportingFrequency')
        ?.patchValue(
          fundValue.sub_fund.reporting_frequency == null
            ? ''
            : fundValue.sub_fund.reporting_frequency
        );
      this.fundForm
        .get('subFundData.S_reclassificationFrequency')
        ?.patchValue(
          fundValue.sub_fund.ReclassificationFrequency
            .reclassification_frequency_name
        );
      this.fundForm
        .get('subFundData.S_productType')
        ?.patchValue(
          fundValue.sub_fund && fundValue.sub_fund.product_type != null
            ? fundValue.sub_fund.product_type.product_type_name
            : ''
        );
      this.fundForm
        .get('subFundData.S_reportingCurrency')
        ?.patchValue(fundValue.sub_fund.report_currency.currency);
      this.fundForm
        .get('subFundData.S_preparer')
        ?.patchValue(fundValue.sub_fund.Preparer);
      this.fundForm
        .get('subFundData.S_PPM')
        ?.patchValue(fundValue.sub_fund.PPM);
      this.fundForm
        .get('subFundData.S_investmentAgreement')
        ?.patchValue(fundValue.sub_fund.Investment_Agreement);
      this.fundForm
        .get('subFundData.S_boardResolutions')
        ?.patchValue(fundValue.sub_fund.boardResolution);
      this.fundForm
        .get('subFundData.S_subscriptionAgreement')
        ?.patchValue(fundValue.sub_fund.Subscription_Agreement);
      this.fundForm
        .get('S_fundStatusReason')
        ?.patchValue(fundValue.sub_fund.reason_to_change);
      if (fundValue.sub_fund.fund_structure == 'close-ended') {
        this.isSimpleOptionSF = true;
        this.fundForm
          .get('subFundData.S_fundLifeYears')
          ?.patchValue(fundValue.sub_fund.fundlifeclose.fundlife);
      } else {
        this.isSimpleOptionSF = false;
        this.fundForm
          .get('subFundData.S_fundLifeYears')
          ?.patchValue(fundValue.sub_fund.fundlifeopen.fundlife);
        this.fundForm
          .get('subFundData.S_investorExtension')
          ?.patchValue(fundValue.sub_fund.fundlifeopen.investor_extension);
        this.fundForm
          .get('subFundData.S_boardExtension')
          ?.patchValue(fundValue.sub_fund.fundlifeopen.board_extension);
        this.fundForm
          .get('subFundData.S_fundLifedocuments')
          ?.patchValue(fundValue.sub_fund.fundlifeopen.fundlife_documents);
      }
    }
    
    this.setValidations();
    console.log(this.fundForm.value);
  }

  refreshDirectors(event: any) {
    this.directors = event;
    this.apiService.getDirectors().subscribe((result: any) => {
      if (result.status == 'ok') {
        this.directors = result.directors;
      }
    });
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
      S_registrationNumber: ['', []],
      S_fundDescription: ['', []],
      S_domicile: ['singapore', []],
      S_fundType: ['regulated', []],
      S_fundManagerEntity: ['', []],
      S_fundManagerRep: ['', []],
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
      S_fundLifeYears: ['', []],
      S_boardExtension: ['', []],
      S_investorExtension: ['', []],
      S_fundLifedocuments: ['', []],
      S_fundEndDate: ['', []],
      S_catchup: [0.0, []],
      S_reportingFrequency: ['month', []],
      S_legalCounsel: ['', []],
      S_legalCounselRep: ['', []],
      S_auditor: ['', []],
      S_auditorRep: ['', []],
      S_trustee: ['', []],
      S_trusteeRep: ['', []],
      S_investmentComittee: [[], []],
      S_directorsList: this.formBuilder.array(this.TransformDirectorsSF()),
      S_subscribers: this.formBuilder.array(this.TransformSubscribersSF()),
      S_authorizedSignatory: [[], []],
      S_signature: ['', []],
      S_boardResolutions: ['', []],
      S_fundAdmin: ['', []],
      S_GIIN: ['', []],
      S_preparer: ['', []],
      S_closingPeriods: this.formBuilder.array(
        this.TransformClosingPeriodsSF()
      ),
      S_reclassificationFreq: ['month', []],
      S_approver: ['', []],
      S_subscriptionAgreement: ['', []],
      S_investmentAgreement: ['', []],
      S_PPM: ['', []],
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
      authorizedSignatory: ['', [Validators.required]],
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

    this.apiService.selectedFund.subscribe((result: any) => {
      if (result) {
        this.selectedFund = result;
        this.spinner.show();
        this.MapValues(this.selectedFund);
        this.spinner.hide();
      } else {
        if (this.router.url.includes('edit')) {
          this.spinner.show();
          this.apiService.getAllFunds().subscribe(
            (res: any) => {
              if (res.status == 'ok') {
                const id = this.route.snapshot.params['id'];
                res.funds.map((result: any) => {
                  if (result.id == id) {
                    this.selectedFund = result;
                    this.MapValues(this.selectedFund);
                    this.spinner.hide();
                  }
                });
              } else {
                this.selectedFund = undefined;
                this.spinner.hide();
                this._snackBar.open(
                  'Error: Go back to list, and edit again!',
                  '',
                  {
                    horizontalPosition: this.horizontalPosition,
                    verticalPosition: this.verticalPosition,
                    duration: 4000,
                  }
                );
              }
            },
            (err) => {
              this.selectedFund = undefined;
              this.spinner.hide();
              this._snackBar.open(
                'Error: Go back to list, and edit again!',
                '',
                {
                  horizontalPosition: this.horizontalPosition,
                  verticalPosition: this.verticalPosition,
                  duration: 4000,
                }
              );
            }
          );
        }
      }
    });

    const current = new Date();
    this.config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    this.config.outsideDays = 'hidden';

    this.setValidations();
  }

setValidations(){
  this.fundForm.get('fundType')!.valueChanges.subscribe((value) => {
    if (value === 'regulated') {
      this.fundForm
        .get('fundManagerEntity')!
        .setValidators([Validators.required]);
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

    if (val.subFund && val.subFund == 'Y') {
      this.fundForm
        .get('subFundData.S_fundName')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_registrationNumber')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_fundDescription')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_authorizedSignatory')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_signature')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_fundAdmin')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_GIIN')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_closingPeriods')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_approver')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_subscriptionAgreement')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_investmentAgreement')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_PPM')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_bankAccount')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_bankAccessId')!
        .setValidators([Validators.required]);
      this.fundForm
        .get('subFundData.S_bankAccessPassword')!
        .setValidators([Validators.required]);

      if (val.subFundData.S_fundType == 'regulated') {
        this.fundForm
          .get('subFundData.S_fundManagerEntity')!
          .setValidators([Validators.required]);
      }

      this.fundForm
        .get('subFundData.S_investmentComittee')!
        .setValidators([Validators.required]);

      if (val.subFundData && val.subFundData.S_fundSize) {
        const issuedShareValueSF =
          val.subFundData.S_fundSize / val.subFundData.S_offerPrice;
        this.fundForm
          .get('subFundData.S_issuedShares')
          ?.patchValue(issuedShareValueSF, {
            emitEvent: false,
          });
      }

      //fOR sub Fund

      if (
        val.subFundData.S_subscribers &&
        val.subFundData.S_subscribers.length &&
        val.subFundData.S_subscribers[0].commitment != 0 &&
        this.fundForm.get('subFundData.S_fundSize')?.value != 0
      ) {
        let sum: number = 0;
        val.subFundData.S_subscribers.map((amount: any) => {
          sum = sum + amount.commitment;
          if (sum <= this.fundForm.get('subFundData.S_fundSize')?.value) {
            this.globalDisableSF = true;
          } else {
            this.globalDisableSF = false;
          }
        });
      }
      if (
        val.fundStructure == 'open-ended'
      ) {
        console.log("here");
        
        this.fundForm.get('boardExtension')?.setValidators([Validators.required]);
        this.fundForm.get('investorExtension')?.setValidators([Validators.required]);
        this.fundForm.get('fundLifedocuments')?.setValidators([Validators.required]);
      }
    }

    //fOR Fund
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

  StatusChangeSubFund(event: any) {
    let value = event.target.value;
    if (value == 'funded' || value == 'freeze' || value == 'close') {
      (this.fundForm.get('subFundData') as FormGroup).disable();
      (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_fundStatus'
      ].enable();
      (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_fundStatusReason'
      ].enable();
      this.isDropdownDisabledSF = true;
    } else {
      (this.fundForm.get('subFundData') as FormGroup).enable();
      (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_fundStatus'
      ].enable();
      (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_fundStatusReason'
      ].enable();
      this.isDropdownDisabledSF = false;
    }

    if (
      this.fundForm.get('subFundData.S_fundStatus')?.value == 'freeze' ||
      this.fundForm.get('subFundData.S_fundStatus')?.value == 'unfreeze' ||
      this.fundForm.get('subFundData.S_fundStatus')?.value == 'refund' ||
      this.fundForm.get('subFundData.S_fundStatus')?.value == 'extendterm'
    ) {
      this.fundForm
        .get('S_fundStatusReason')
        ?.setValidators([Validators.required, Validators.maxLength(2048)]);
    } else {
      this.fundForm.get('S_fundStatusReason')!.setValidators(null);
    }

    if (value == 'onboarding') {
      this.fundForm
        .get('subFundData.S_legalCounsel')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('subFundData.S_legalCounselRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('subFundData.S_auditor')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('subFundData.S_auditorRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('subFundData.S_trustee')!
        .setValidators([Validators.required, Validators.maxLength(256)]);

      this.fundForm
        .get('subFundData.S_trusteeRep')!
        .setValidators([Validators.required, Validators.maxLength(256)]);
    }

    console.log(this.fundForm
      .get('subFundData.S_fundStructure')!.value);
    
    if (
      this.fundForm
      .get('subFundData.S_fundStructure')!.value == 'open-ended'
    ) {
      this.fundForm.get('subFundData.S_boardExtension')?.setValidators([Validators.required]);
      this.fundForm.get('subFundData.S_investorExtension')?.setValidators([Validators.required]);
      this.fundForm.get('subFundData.S_fundLifedocuments')?.setValidators([Validators.required]);
    }
  }

  StatusChange(event: any) {
    let value = event.target.value;
    if (value == 'funded' || value == 'freeze' || value == 'close') {
      this.fundForm.disable();
      this.fundForm.get('fundStatus')?.enable();
      this.fundForm.get('fundStatusReason')?.enable();
      this.isDropdownDisabled = true;
    } else {
      this.fundForm.enable();
      this.fundForm.get('fundStatus')?.enable();
      this.fundForm.get('fundStatusReason')?.enable();
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

    if (value == 'onboarding') {
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
    }
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

  handleFileInput(name: string, event: any, subfund = false) {
    const formData: FormData = new FormData();
    let file = event.target.files[0];
    formData.append(name, file, file['name']);
    if (subfund) {
      (this.fundForm.get('subFundData') as FormGroup).controls[name].setValue(
        formData
      );
    } else {
      this.fundForm.get(name)?.setValue(formData);
    }
    file = undefined;
  }

  handleFileInputDirector(index: number, event: any, subfund = false) {
    let keyName = '';
    if (subfund) {
      let control = (
        (this.fundForm.get('subFundData') as FormGroup).controls[
          'S_directorsList'
        ] as FormArray
      )?.value[index];

      const formData: FormData = new FormData();
      let file = event.target.files[0];
      if (!control.name[0].id) {
        keyName = this.MapIdFromName(control.name[0]).toString();
      } else {
        keyName = control.name[0].id;
      }
      formData.append('director_' + keyName, file);

      (
        (this.fundForm.get('subFundData.S_directorsList') as FormArray)
          ?.controls as any
      )[index].controls.signature.setValue(formData);
      file = undefined;
    } else {
      let controlForName = this.fundForm.get('directorsList')?.value[index];

      if (!controlForName.name[0].id) {
        keyName = this.MapIdFromName(controlForName.name[0]).toString();
      } else {
        keyName = controlForName.name[0].id;
      }

      const formData: FormData = new FormData();
      let file = event.target.files[0];
      formData.append('director_' + keyName, file);

      ((this.fundForm.get('directorsList') as FormArray)?.controls as any)[
        index
      ].controls.signature.setValue(formData);

      file = undefined;
    }
  }

  handleFileMultipleInput(name: string, event: any, subfund = false) {
    const formData = new FormData();
    for (let i = 0; i < event.target.files.length; i++) {
      formData.append(name, event.target.files[i]);
      if (i == event.target.files.length - 1) {
        if (subfund) {
          (this.fundForm.get('subFundData') as FormGroup).controls[
            name
          ].setValue(formData);
        } else {
          this.fundForm.get(name)?.setValue(formData);
        }
      }
    }
  }

  nextStep() {
    if (this.sectionNo != this.maxNumberOfTabs) {
      this.sectionNo = this.sectionNo + 1;
    }
  }

  previousStep() {
    this.sectionNo = this.sectionNo - 1;
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

  TransformSubscribersSF(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        name: ['', []],
        commitment: [0.0, []],
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

  TransformClosingPeriodsSF(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        date: ['', []],
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

  TransformDirectorsSF(): FormGroup[] {
    let fb: FormGroup[] = [];
    fb.push(
      this.formBuilder.group({
        name: ['', []],
        signature: [null, []],
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
    return fb;
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
    if (subfund) {
      let subDates = (this.fundForm.get('subFundData') as FormGroup).controls[
        'S_subscribers'
      ] as FormArray;
      subDates.push(fb);
    } else {
      let subscribers = this.fundForm.get('subscribers') as FormArray;
      subscribers.push(fb);
    }
  }

  removeSubscriber(index: any, subfund = false) {
    if (subfund) {
      (
        (this.fundForm.get('subFundData') as FormGroup).controls[
          'S_subscribers'
        ] as FormArray
      ).removeAt(index);
    } else {
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

  MapFromDirectors(name: string) {
    let str = '';
    this.directors.map((res: any) => {
      if (res.director_name == name) str = res.id;
    });
    return str.toString();
  }

  ParseDirectors(arr: any) {
    let retArr: any = [];
    arr.map((result: any) => {
      if (result && result.id) {
        retArr.push(result.id.toString());
      } else {
        retArr.push(this.MapFromDirectors(result));
      }
    });
    return retArr;
  }

  MapIdFromName(name: any) {
    let str = '';
    if (this.selectedFund && this.selectedFund.id && !Number.isInteger(name)) {
      this.directors.map((res: any) => {
        if (res.director_name === name[0]) {
          str = res.id.toString();
        }
      });
    } else {
      str = name && name.length ? name[0].id.toString() : '';
    }
    return str;
  }

  ParseSubscribersOrDirectorList(arr: any) {
    arr.map((res: any) => {
      res.name = this.MapIdFromName(res.name);
    });
    return arr;
  }

  MapSubscribers(arr: any) {
    arr.map((res: any) => {
      if (res.name[0].director_name) {
        res.name = res.name[0].director_name;
      } else {
        res.name = res.name;
      }
    });
    return arr;
  }

  findInvalidControls() {
    const invalid = [];
    const controls = this.fundForm.controls;
    for (const name in controls) {
      
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    if(this.fundForm.get('fundStructure')?.value == 'open-ended' && (this.fundForm.get('fundLifedocuments')?.value == null || !this.fundForm.get('fundLifedocuments')?.value.length)) invalid.push('fundLifedocuments'); this.fundForm.get('fundLifedocuments')?.setErrors({'incorrect': true});
    if(this.fundForm.get('fundStructure')?.value == 'open-ended' && !this.fundForm.get('boardExtension')?.value) invalid.push('boardExtension'); this.fundForm.get('boardExtension')?.setErrors({'incorrect': true});
    if(this.fundForm.get('fundStructure')?.value == 'open-ended' && !this.fundForm.get('investorExtension')?.value) invalid.push('investorExtension'); this.fundForm.get('investorExtension')?.setErrors({'incorrect': true});

    return this.MapFieldNames(invalid);
  }

  MapFieldNames(fields: any) {
    let obj: any = {
      fundName: 'Fund Name',
      registrationNumber: 'Registration Number',
      fundDescription: 'Fund Description',
      domicile: 'Domicile',
      fundType: 'Fund type',
      fundManagerEntity: 'Fund Manager Entity',
      fundManagerRep: 'Fund Manager Entity Representative',
      boardExtension: 'Board Extension',
      investorExtension: 'Investor Extension',
      fundLifeYears: 'Fund life years',
      fundLifedocuments: 'Document for Fund Life',
      fundStructure: 'Fund structure',
      directors: 'Directors List',
      offerPrice: 'Offer price',
      fundSize: 'Fund size',
      issuedShares: 'Issued Shares',
      ordinaryShare: 'Ordinary Share',
      fundEndDate: 'Fund End date',
      fundStatus: 'Fund status',
      fundStatusReason: 'Fund status reason',
      reportingCurrency: 'Reporting currency',
      lockupPeriod: 'Lock up period',
      fundYearEnd: 'Fund year end',
      productType: 'Product type',
      catchup: 'Catchup',
      reportingFrequency: 'Reporting Frequency',
      legalCounsel: 'Legal Counsel',
      legalCounselRep: 'Legal Counsel Representative',
      auditor: 'Auditor',
      auditorRep: 'Auditor Representative',
      trustee: 'Trustee',
      trusteeRep: 'Trustee Representative',
      subscribers: 'Subscribers List',
      investmentComittee: 'Investment Committee',
      authorizedSignatory: 'Authorized Signatory',
      fundAdmin: 'Fund Admin',
      GIIN: 'GIIN',
      preparer: 'Preparer',
      closingPeriod: 'Closing Period',
      reclassificationFreq: 'Re-classification Frequency',
      approver: 'Approver',
      directorFee: "Director's Fees",
      managementFee: 'Management Fees',
      hurdleRate: 'Hurdle rate',
      CTC: 'CTC',
      bank: 'Bank',
      bankAccount: 'Bank account number',
      bankAccessId: 'Bank access Id',
      bankAccessPassword: 'Bank access password',
      redeem: 'Redeem',
      redeemReason: 'Reason to redeem',
      liquidate: 'Liquidate',
      liquidateReason: 'Reason to liquidate',
    };
    let fieldNames: any = [];
    fields.map((res: any) => {
      if (this.keyInArray(obj, res)) {
        fieldNames.push(obj[res]);
      }
    });
    return fieldNames;
  }

  keyInArray(obj: any, value: string) {
    let bool = false;
    let arr = Object.keys(obj);
    if (arr.includes(value)) bool = true;
    else bool = false;

    return bool;
  }

  Submit(id?: any) {
    /**
     * file controls:
     * director signature -> single
     * ppm -> single
     * investment agreement -> single
     * subscription agreement -> single
     * board resolutions -> multiple
     * fund life docs -> multiple
     * signature -> single
     */
    this.showInvalidControls = this.findInvalidControls();
    console.log(this.fundForm.get('fundLifedocuments')?.value);
    
    console.log(this.showInvalidControls);
    console.log(this.fundForm.valid);

    let directorsArraySF = [];
    let directorsArray = [];
    let closingPeriodArraySF = [];
    let closingPeriodArray = [];
    // if (this.fundForm.valid && this.showInvalidControls && !this.showInvalidControls.length) {
    let formData = new FormData();
    let boardResolutionArrs: any = [];
    let subFundDataObj = {};
    let fundLifeArrs: any = [];
    let boardResolutionArrsSF: any = [];
    // SUB FUND
    if (this.fundForm.get('subFund')?.value == 'Y') {
      if (
        this.fundForm.get('subFundData.S_boardResolutions')?.value &&
        this.fundForm.get('subFundData.S_boardResolutions')?.value instanceof
          FormData
      ) {
        for (let pair of this.fundForm
          .get('subFundData.S_boardResolutions')
          ?.value.entries()) {
          boardResolutionArrsSF.push(pair[1]);
          if (
            boardResolutionArrsSF.length ==
            this.fundForm.get('subFundData.S_boardResolutions')?.value.length
          ) {
            formData.append('S_boardResolutions', boardResolutionArrsSF);
            return;
          }
        }
      }

      if (
        this.fundForm.get('subFundData.S_fundStructure')?.value ==
          'open-ended' &&
        this.fundForm.get('subFundData.S_fundLifedocuments')?.value instanceof
          FormData
      ) {
        for (let pair of this.fundForm
          .get('subFundData.S_fundLifedocuments')
          ?.value.entries()) {
          fundLifeArrs.push(pair[1]);
          if (
            fundLifeArrs.length ==
            this.fundForm.get('subFundData.S_fundLifedocuments')?.value.length
          ) {
            formData.append('S_fundLifedocuments', fundLifeArrs);
            return;
          }
        }
      }

      if (
        this.fundForm.get('subFundData.S_directorsList')?.value &&
        this.fundForm.get('subFundData.S_directorsList')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_directorsList')
          ?.setValue(
            this.ParseSubscribersOrDirectorList(
              this.fundForm.get('subFundData.S_directorsList')?.value
            )
          );

        directorsArraySF = this.fundForm
          .get('subFundData.S_directorsList')
          ?.value.map((obj: any) => {
            return obj.name;
          });

        this.fundForm
          .get('subFundData.S_directorsList')
          ?.value.map((result: any) => {
            if (
              result.signature != null &&
              result.signature instanceof FormData
            ) {
              for (let pair of result.signature.entries()) {
                formData.append(pair[0], pair[1]);
              }
            }
          });
      }

      if (
        this.fundForm.get('subFundData.S_closingPeriods')?.value &&
        this.fundForm.get('subFundData.S_closingPeriods')?.value.length &&
        this.fundForm.get('subFundData.S_closingPeriods')?.value[0].date != ''
      ) {
        let arr = this.ParseDateFormatMultiple(
          this.fundForm.get('subFundData.S_closingPeriods')?.value
        );
        this.fundForm.get('subFundData.S_closingPeriods')?.setValue(arr);
        closingPeriodArraySF = this.fundForm
          .get('subFundData.S_closingPeriods')
          ?.value.map((obj: any) => {
            return obj.date;
          });
      }

      if (this.fundForm.get('subFundData.S_redeem')?.value) {
        this.fundForm
          .get('subFundData.S_redeem')
          ?.setValue(
            this.ParseDateFormatSingle(
              this.fundForm.get('subFundData.S_redeem')?.value
            )
          );
      }

      if (this.fundForm.get('subFundData.S_fundEndDate')?.value != null) {
        this.fundForm
          .get('subFundData.S_fundEndDate')
          ?.setValue(
            this.ParseDateFormatSingle(
              this.fundForm.get('subFundData.S_fundEndDate')?.value
            )
          );
      }

      if (
        this.fundForm.get('subFundData.S_approver')?.value &&
        this.fundForm.get('subFundData.S_approver')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_approver')
          ?.setValue(
            this.ParseDirectors(
              Array.isArray(this.fundForm.get('subFundData.S_approver')?.value)
                ? this.fundForm.get('subFundData.S_approver')?.value
                : [this.fundForm.get('subFundData.S_approver')?.value]
            )
          );
      }
      if (
        this.fundForm.get('subFundData.S_authorizedSignatory')?.value &&
        this.fundForm.get('subFundData.S_authorizedSignatory')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_authorizedSignatory')
          ?.setValue(
            this.ParseDirectors(
              Array.isArray(
                this.fundForm.get('subFundData.S_authorizedSignatory')?.value
              )
                ? this.fundForm.get('subFundData.S_authorizedSignatory')?.value
                : [
                    this.fundForm.get('subFundData.S_authorizedSignatory')
                      ?.value,
                  ]
            )
          );
      }
      if (
        this.fundForm.get('subFundData.S_fundManagerRep')?.value &&
        this.fundForm.get('subFundData.S_fundManagerRep')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_fundManagerRep')
          ?.setValue(
            this.ParseDirectors(
              Array.isArray(
                this.fundForm.get('subFundData.S_fundManagerRep')?.value
              )
                ? this.fundForm.get('subFundData.S_fundManagerRep')?.value
                : [this.fundForm.get('subFundData.S_fundManagerRep')?.value]
            )
          );
      }

      if (
        this.fundForm.get('subFundData.S_investmentComittee')?.value &&
        this.fundForm.get('subFundData.S_investmentComittee')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_investmentComittee')
          ?.setValue(
            this.ParseDirectors(
              Array.isArray(
                this.fundForm.get('subFundData.S_investmentComittee')?.value
              )
                ? this.fundForm.get('subFundData.S_investmentComittee')?.value
                : [this.fundForm.get('subFundData.S_investmentComittee')?.value]
            )
          );
      }

      // SUB FUND:
      if (this.fundForm.get('subFundData.S_PPM')?.value) {
        for (let pair of this.fundForm
          .get('subFundData.S_PPM')
          ?.value.entries()) {
          formData.append(pair[0], pair[1]);
        }
      }

      if (this.fundForm.get('subFundData.S_investmentAgreement')?.value) {
        for (let pair of this.fundForm
          .get('subFundData.S_investmentAgreement')
          ?.value.entries()) {
          formData.append(pair[0], pair[1]);
        }
      }

      if (this.fundForm.get('subFundData.S_subscriptionAgreement')?.value) {
        for (let pair of this.fundForm
          .get('subFundData.S_subscriptionAgreement')
          ?.value.entries()) {
          formData.append(pair[0], pair[1]);
        }
      }

      if (this.fundForm.get('subFundData.S_signature')?.value) {
        for (let pair of this.fundForm
          .get('subFundData.S_signature')
          ?.value.entries()) {
          formData.append(pair[0], pair[1]);
        }
      }

      if (
        this.fundForm.get('subFundData.S_subscribers')?.value &&
        this.fundForm.get('subFundData.S_subscribers')?.value.length
      ) {
        this.fundForm
          .get('subFundData.S_subscribers')
          ?.setValue(
            this.MapSubscribers(
              this.fundForm.get('subFundData.S_subscribers')?.value
            )
          );
      }
      subFundDataObj = {
        fundName: this.fundForm.get('subFundData.S_fundName')?.value,
        registrationNumber: this.fundForm.get(
          'subFundData.S_registrationNumber'
        )?.value,
        fundDescription: this.fundForm.get('subFundData.S_fundDescription')
          ?.value,
        domicile: this.fundForm.get('subFundData.S_domicile')?.value,
        fundType: this.fundForm.get('subFundData.S_fundType')?.value,
        fundManagerEntity: this.fundForm.get('subFundData.S_fundManagerEntity')
          ?.value,
        fundManagerRep: this.fundForm.get('subFundData.S_fundManagerRep')
          ?.value,
        boardExtension:
          this.fundForm.get('subFundData.S_fundStructure')?.value ==
          'open-ended'
            ? this.fundForm.get('subFundData.S_boardExtension')?.value
            : '',
        investorExtension:
          this.fundForm.get('subFundData.S_fundStructure')?.value ==
          'open-ended'
            ? this.fundForm.get('subFundData.S_investorExtension')?.value
            : '',
        fundLife: this.fundForm.get('subFundData.S_fundLifeYears')?.value,
        fundStructure: this.fundForm.get('subFundData.S_fundStructure')?.value,
        assetUnderManagement: '0.0',
        directors: directorsArraySF,
        offerPrice: this.fundForm.get('subFundData.S_offerPrice')?.value,
        fundSize: this.fundForm.get('subFundData.S_fundSize')?.value,
        issuedShares: this.fundForm.get('subFundData.S_issuedShares')?.value,
        ordinaryShare: this.fundForm.get('subFundData.S_ordinaryShare')?.value,
        fundEndDate: this.fundForm.get('subFundData.S_fundEndDate')?.value,
        fundStatus: this.fundForm.get('subFundData.S_fundStatus')?.value,
        fundStatusReason: this.fundForm.get('subFundData.S_fundStatusReason')
          ?.value,
        reportingCurrency: this.fundForm.get('subFundData.S_reportingCurrency')
          ?.value,
        lockupPeriod: this.fundForm.get('subFundData.S_lockupPeriod')?.value,
        fundYearEnd: this.fundForm.get('subFundData.S_fundYearEnd')?.value,
        productType: this.fundForm.get('subFundData.S_productType')?.value,
        catchup: this.fundForm.get('subFundData.S_catchup')?.value,
        reportingFrequency: this.fundForm.get(
          'subFundData.S_reportingFrequency'
        )?.value,
        legalCounsel: this.fundForm.get('subFundData.S_legalCounsel')?.value,
        legalCounselRep: this.fundForm.get('subFundData.S_legalCounselRep')
          ?.value,
        auditor: this.fundForm.get('subFundData.S_auditor')?.value,
        auditorRep: this.fundForm.get('subFundData.S_auditorRep')?.value,
        trustee: this.fundForm.get('subFundData.S_trustee')?.value,
        trusteeRep: this.fundForm.get('subFundData.S_trusteeRep')?.value,
        subscribers: this.fundForm.get('subFundData.S_subscribers')?.value,
        investmentComittee: this.fundForm.get(
          'subFundData.S_investmentComittee'
        )?.value,
        authorizedSignatory: this.fundForm.get(
          'subFundData.S_authorizedSignatory'
        )?.value,
        fundAdmin: this.fundForm.get('subFundData.S_fundAdmin')?.value,
        GIIN: this.fundForm.get('subFundData.S_GIIN')?.value,
        closingPeriod: closingPeriodArraySF,
        reclassificationFreq: this.fundForm.get(
          'subFundData.S_reclassificationFreq'
        )?.value,
        approver: this.fundForm.get('subFundData.S_approver')?.value,
        directorFee: this.fundForm.get('subFundData.S_directorFee')?.value,
        managementFee: this.fundForm.get('subFundData.S_managementFee')?.value,
        hurdleRate: this.fundForm.get('subFundData.S_hurdleRate')?.value,
        CTC: this.fundForm.get('subFundData.S_CTC')?.value,
        preparer: this.fundForm.get('subFundData.S_preparer')?.value,
        bank: this.fundForm.get('subFundData.S_bank')?.value,
        bankAccount: this.fundForm.get('subFundData.S_bankAccount')?.value,
        bankAccessId: this.fundForm.get('subFundData.S_bankAccessId')?.value,
        bankAccessPassword: this.fundForm.get(
          'subFundData.S_bankAccessPassword'
        )?.value,
        redeem: this.fundForm.get('subFundData.S_redeem')?.value,
        redeemReason: this.fundForm.get('subFundData.S_redeemReason')?.value,
        liquidate: this.fundForm.get('subFundData.S_liquidate')?.value,
        liquidateReason: this.fundForm.get('subFundData.S_liquidateReason')
          ?.value,
      };
    }

    //END OF SUB FUND

    // if (
    //   this.fundForm.get('boardResolutions')?.value &&
    //   this.fundForm.get('boardResolutions')?.value instanceof FormData
    // ) {

    //   for (let pair of this.fundForm.get('boardResolutions')?.value.entries()) {
    //     boardResolutionArrs.push(pair[1]);
    //   }
      

    //   formData.append('boardResolutions', boardResolutionArrs);
    // } else {
    //   formData.append('boardResolutions', '');
    // }

    if (
      this.fundForm.get('boardResolutions')?.value &&
      this.fundForm.get('boardResolutions')?.value instanceof FormData
    ) {
      for (let pair of this.fundForm
        .get('boardResolutions')
        ?.value.entries()) {
        formData.append(pair[0], pair[1]);
      }
    } else {
      formData.append('boardResolutions', '');
    }


    
    console.log(this.fundForm.get('boardResolutions')?.value);
    console.log(formData.getAll('boardResolutions')[0]);

    
    if (this.fundForm.get('fundStructure')?.value == 'open-ended') {
      
      // if (
      //   this.fundForm.get('fundLifedocuments')?.value &&
      //   this.fundForm.get('fundLifedocuments')?.value instanceof FormData
      // ) {
      //   for (let pair of this.fundForm
      //     .get('fundLifedocuments')
      //     ?.value.entries()) {
      //     fundLifeArrs.push(pair[1]);
      //   } 
      //   formData.append('fundLifedocuments', fundLifeArrs);
      // }else {
      //   formData.append('fundLifedocuments', '');
      // }

      if (
        this.fundForm.get('fundLifedocuments')?.value &&
        this.fundForm.get('fundLifedocuments')?.value instanceof FormData
      ) {
        for (let pair of this.fundForm
          .get('fundLifedocuments')
          ?.value.entries()) {
          formData.append(pair[0], pair[1]);
        }
      } else {
        formData.append('fundLifedocuments', '');
      }
      
    }

    console.log(this.fundForm.get('fundLifedocuments')?.value);
    console.log(formData.getAll('fundLifedocuments')[0]);

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
      this.fundForm.get('directorsList')?.value.map((result: any) => {
        if (result.signature != null && result.signature instanceof FormData) {
          for (let pair of result.signature.entries()) {
            formData.append(pair[0], pair[1]);
          }
        }
      });

      directorsArray = this.fundForm
        .get('directorsList')
        ?.value.map((obj: any) => {
          return obj.name;
        });
    }

    if (
      this.fundForm.get('closingPeriods')?.value &&
      this.fundForm.get('closingPeriods')?.value.length &&
      this.fundForm.get('closingPeriods')?.value[0].date != ''
    ) {
      let arr = this.ParseDateFormatMultiple(
        this.fundForm.get('closingPeriods')?.value
      );
      this.fundForm.get('closingPeriods')?.setValue(arr);
      closingPeriodArray = this.fundForm
        .get('closingPeriods')
        ?.value.map((obj: any) => {
          return obj.date;
        });
    }

    if (this.fundForm.get('redeem')?.value) {
      this.fundForm
        .get('redeem')
        ?.setValue(
          this.ParseDateFormatSingle(this.fundForm.get('redeem')?.value)
        );
    }

    if (this.fundForm.get('fundEndDate')?.value != null) {
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
        ?.setValue(
          this.ParseDirectors(
            Array.isArray(this.fundForm.get('approver')?.value)
              ? this.fundForm.get('approver')?.value
              : [this.fundForm.get('approver')?.value]
          )
        );
    }

    if (
      this.fundForm.get('authorizedSignatory')?.value &&
      this.fundForm.get('authorizedSignatory')?.value.length
    ) {
      this.fundForm
        .get('authorizedSignatory')
        ?.setValue(
          this.ParseDirectors(
            Array.isArray(this.fundForm.get('authorizedSignatory')?.value)
              ? this.fundForm.get('authorizedSignatory')?.value
              : [this.fundForm.get('authorizedSignatory')?.value]
          )
        );
    }
    if (
      this.fundForm.get('fundManagerRep')?.value &&
      this.fundForm.get('fundManagerRep')?.value.length
    ) {
      this.fundForm
        .get('fundManagerRep')
        ?.setValue(
          this.ParseDirectors(
            Array.isArray(this.fundForm.get('fundManagerRep')?.value)
              ? this.fundForm.get('fundManagerRep')?.value
              : [this.fundForm.get('fundManagerRep')?.value]
          )
        );
    }

    if (
      this.fundForm.get('investmentComittee')?.value &&
      this.fundForm.get('investmentComittee')?.value.length
    ) {
      this.fundForm
        .get('investmentComittee')
        ?.setValue(
          this.ParseDirectors(
            Array.isArray(this.fundForm.get('investmentComittee')?.value)
              ? this.fundForm.get('investmentComittee')?.value
              : [this.fundForm.get('investmentComittee')?.value]
          )
        );
    }

    if (
      this.fundForm.get('subscribers')?.value &&
      this.fundForm.get('subscribers')?.value.length &&
      this.fundForm.get('subscribers')?.value[0].name &&
      this.fundForm.get('subscribers')?.value[0].name.length
    ) {
      this.fundForm
        .get('subscribers')
        ?.setValue(
          this.MapSubscribers(this.fundForm.get('subscribers')?.value)
        );
      console.log(this.fundForm.get('subscribers')?.value);
      console.log(this.fundForm.get('subscribers')?.value);
    }
    let obj: any = {
      fundName: this.fundForm.get('fundName')?.value,
      registrationNumber: this.fundForm.get('registrationNumber')?.value,
      fundDescription: this.fundForm.get('fundDescription')?.value,
      subFund: this.fundForm.get('subFund')?.value,
      preparer: this.fundForm.get('preparer')?.value,
      subFundData:
        this.fundForm.get('subFund')?.value == 'Y' ? subFundDataObj : undefined,
      assetUnderManagement: '0.0',
      domicile: this.fundForm.get('domicile')?.value,
      fundType: this.fundForm.get('fundType')?.value,
      fundManagerEntity: this.fundForm.get('fundManagerEntity')?.value,
      fundManagerRep: this.fundForm.get('fundManagerRep')?.value,
      fundStructure: this.fundForm.get('fundStructure')?.value,
      offerPrice: this.fundForm.get('offerPrice')?.value,
      fundSize: this.fundForm.get('fundSize')?.value,
      boardExtension:
        this.fundForm.get('fundStructure')?.value == 'open-ended'
          ? this.fundForm.get('boardExtension')?.value
          : '',
      investorExtension:
        this.fundForm.get('fundStructure')?.value == 'open-ended'
          ? this.fundForm.get('investorExtension')?.value
          : '',
      fundLife: this.fundForm.get('fundLifeYears')?.value,
      issuedShares: this.fundForm.get('issuedShares')?.value,
      ordinaryShare: this.fundForm.get('ordinaryShare')?.value,
      fundEndDate: this.fundForm.get('fundEndDate')?.value,
      fundStatus: this.fundForm.get('fundStatus')?.value,
      fundStatusReason: this.fundForm.get('fundStatusReason')?.value,
      reportingCurrency: this.fundForm.get('reportingCurrency')?.value,
      lockupPeriod: this.fundForm.get('lockupPeriod')?.value,
      fundYearEnd: this.fundForm.get('fundYearEnd')?.value,
      productType: this.fundForm.get('productType')?.value,
      catchup: this.fundForm.get('catchup')?.value,
      reportingFrequency: this.fundForm.get('reportingFrequency')?.value,
      legalCounsel: this.fundForm.get('legalCounsel')?.value,
      legalCounselRep: this.fundForm.get('legalCounselRep')?.value,
      auditor: this.fundForm.get('auditor')?.value,
      auditorRep: this.fundForm.get('auditorRep')?.value,
      trustee: this.fundForm.get('trustee')?.value,
      trusteeRep: this.fundForm.get('trusteeRep')?.value,
      subscribers: this.fundForm.get('subscribers')?.value,
      directors: directorsArray,
      investmentComittee: this.fundForm.get('investmentComittee')?.value,
      authorizedSignatory: this.fundForm.get('authorizedSignatory')?.value,
      fundAdmin: this.fundForm.get('fundAdmin')?.value,
      GIIN: this.fundForm.get('GIIN')?.value,
      closingPeriod: closingPeriodArray,
      reclassificationFreq: this.fundForm.get('reclassificationFreq')?.value,
      approver: this.fundForm.get('approver')?.value,
      directorFee: this.fundForm.get('directorFee')?.value,
      managementFee: this.fundForm.get('managementFee')?.value,
      hurdleRate: this.fundForm.get('hurdleRate')?.value,
      CTC: this.fundForm.get('CTC')?.value,
      bank: this.fundForm.get('bank')?.value,
      bankAccount: this.fundForm.get('bankAccount')?.value,
      bankAccessId: this.fundForm.get('bankAccessId')?.value,
      bankAccessPassword: this.fundForm.get('bankAccessPassword')?.value,
      redeem: this.fundForm.get('redeem')?.value,
      redeemReason: this.fundForm.get('redeemReason')?.value,
      liquidate: this.fundForm.get('liquidate')?.value,
      liquidateReason: this.fundForm.get('liquidateReason')?.value,
    };
    console.log(obj);

    formData.append('json', JSON.stringify(obj));

    if (
      this.fundForm.get('PPM')?.value &&
      this.fundForm.get('PPM')?.value instanceof FormData
    ) {
      for (let pair of this.fundForm.get('PPM')?.value.entries()) {
        formData.append(pair[0], pair[1]);
      }
    }

    if (
      this.fundForm.get('investmentAgreement')?.value &&
      this.fundForm.get('investmentAgreement')?.value instanceof FormData
    ) {
      for (let pair of this.fundForm
        .get('investmentAgreement')
        ?.value.entries()) {
        formData.append(pair[0], pair[1]);
      }
    }

    if (
      this.fundForm.get('subscriptionAgreement')?.value &&
      this.fundForm.get('subscriptionAgreement')?.value instanceof FormData
    ) {
      for (let pair of this.fundForm
        .get('subscriptionAgreement')
        ?.value.entries()) {
        formData.append(pair[0], pair[1]);
      }
    }

    if (
      this.fundForm.get('signature')?.value &&
      this.fundForm.get('signature')?.value instanceof FormData
    ) {
      for (let pair of this.fundForm.get('signature')?.value.entries()) {
        formData.append(pair[0], pair[1]);
      }
    }

    console.log(this.fundForm.get('boardResolutions'));

    console.log(this.fundForm.get('signature')?.value);
    console.log(formData.get('signature'));
    
    this.fundForm.value.created_at = id
      ? this.fundForm.value.created_at
      : new Date().toISOString();
    this.fundForm.value.updated_at = id ? new Date().toISOString() : null;
    console.log(formData.get('json'), typeof formData.get('json'));
    console.log(id);

    if (id) {
      this.spinner.show();
      formData.append('fund_id', id);
      this.apiService.onEdit(formData).subscribe(
        (result: any) => {
          console.log(result);
          
          if (result.status == 'ok') {
            this._snackBar.open('Fund edited successfully!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
            this.fundForm.reset();
            this.router.navigate(['dashboard/funds/list']);
            this.spinner.hide();
          } else {
            this._snackBar.open('Error in editing fund!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
            this.spinner.hide();
          }
        },
        (err: any) => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.show();
      this.apiService.onSave(formData).subscribe(
        (result: any) => {
          if (result.status == 'ok') {
            this._snackBar.open('Fund created successfully!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
            this.fundForm.reset();
            this.router.navigate(['dashboard/funds/list']);
            this.spinner.hide();
          } else {
            this._snackBar.open('Error in saving fund!', '', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 4000,
            });
            this.spinner.hide();
          }
        },
        (err: any) => {
          this.spinner.hide();
        }
      );
    }
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
        this.selectedFund = undefined;
      } else {
        return;
      }
    });
  }

  ngOnDestroy(): void {
    this.selectedFund = undefined;
  }
}
