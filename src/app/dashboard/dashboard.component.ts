import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { DashboardService } from './dashboard.service';
import { dropDownValues } from './dropdonw_values.cnst';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  empId = new FormControl('', Validators.required);
  empName = new FormControl('', Validators.required);
  queryParamsEmpId = null;
  showDropdownForm = false;
  dropDownFormGroup = new FormGroup({
    formulaValue: new FormControl('-1', Validators.required),
    numerator: new FormControl('', Validators.required),
    denominator: new FormControl('', Validators.required),
    insertedDate: new FormControl(null, Validators.required)
  });
  availableFormulaValues = JSON.parse(JSON.stringify(dropDownValues));
  getHeaders = Object.keys;
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MMM-YYYY',
    maxDate: new Date(),
    minMode: 'month',
    adaptivePosition: true
  };
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    route.queryParams.subscribe( data => {
      if (data.empId) {
        this.queryParamsEmpId = data.empId;
        this.showDropdownForm = true;
      } else {
        this.showDropdownForm = false;
      }
      this.resetFormGroup();
    });
  }

  ngOnInit(): void {
  }

  public resetFormGroup(): void {
    this.dropDownFormGroup.reset();
    this.dropDownFormGroup.patchValue({ formulaValue: '-1'});
  }

  public submitForm(): void {
    if (this.empId.invalid || this.empName.invalid) {
      console.log('invalid details to add the employee');
      return;
    }
    if (this.dashboardService.verifyUserExistOrNot(this.empId.value)) {
      console.log('user already existed here');
      alert('user already exists');
      return;
    }
    this.dashboardService.addEmployee(this.empId.value, this.empName.value);
    this.goToQueryParam(JSON.parse(JSON.stringify(this.empId.value)));
    this.empId.reset();
    this.empName.reset();
  }

  public goToQueryParam(employeeId): void {
    if (!employeeId) {
      return;
    }
    this.router.navigate([''], {
      relativeTo: this.route,
      queryParams: {
        empId: employeeId
      }
    });
  }

  public submitDropDownForm(): void {
    console.log(this.dropDownFormGroup.value);
    if (this.dropDownFormGroup.invalid) {
      alert('submit form is invalid');
      return;
    }
    if (this.dropDownFormGroup.value.formulaValue == '-1') {
      return;
    }
    let formGroupValue = this.dropDownFormGroup.value;
    if (formGroupValue.numerator > formGroupValue.denominator) {
      console.log('numerator should less than or equal to denominator');
      return;
    }
    formGroupValue.enteredBy = this.queryParamsEmpId;
    this.dashboardService.addFormulaStatistics(formGroupValue);
    // this.dropDownFormGroup.reset();
    this.resetFormGroup();
  }
}
