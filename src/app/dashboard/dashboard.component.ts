import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../services/auth.service';
import { DashboardService } from './dashboard.service';
import { DepartmentValues } from './dropdonw_values.cnst';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  queryParamsEmpId = null;
  showDropdownForm = false;
  dropDownFormGroup = new FormGroup({
    empId: new FormControl('', Validators.required),
    empName: new FormControl('', Validators.required),
    department: new FormControl('-1', Validators.required),
    kpiValue: new FormControl('-1', Validators.required),
    numerator: new FormControl('', Validators.required),
    denominator: new FormControl('', Validators.required),
    insertedDate: new FormControl(null, Validators.required)
  });
  availabledepartments = JSON.parse(JSON.stringify(DepartmentValues));
  minDate = new Date();
  getHeaders = Object.keys;
  userInfo: any = {};
  bsConfig: Partial<BsDatepickerConfig> = {
    dateInputFormat: 'MMM-YYYY',
    maxDate: new Date(),
    minMode: 'month',
    adaptivePosition: true
  };
  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
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
    this.userInfo = this.authService.getUserDetails();
    console.log(this.userInfo)
    this.minDate.setDate(0);
    this.minDate.setMonth(0);
    this.bsConfig.minDate = this.minDate;
    this.dropDownFormGroup.get('empId').setValue(this.userInfo.id)
    this.dropDownFormGroup.get('empName').setValue(this.userInfo.empName);
    this.dropDownFormGroup.get('empName').disable();
  }

  public resetFormGroup(): void {
    this.dropDownFormGroup.reset();
    this.dropDownFormGroup.patchValue({ department: '-1', kpiValue: '-1'});
    this.dropDownFormGroup.get('empId').setValue(this.userInfo.id)
    this.dropDownFormGroup.get('empName').setValue(this.userInfo.empName);
    this.dropDownFormGroup.get('empName').disable();
  }

  // public submitForm(): void {
  //   if (this.empId.invalid || this.empName.invalid) {
  //     console.log('invalid details to add the employee');
  //     return;
  //   }
  //   if (this.dashboardService.verifyUserExistOrNot(this.empId.value)) {
  //     console.log('user already existed here');
  //     alert('user already exists');
  //     return;
  //   }
  //   this.dashboardService.addEmployee(this.empId.value, this.empName.value);
  //   this.goToQueryParam(JSON.parse(JSON.stringify(this.empId.value)), this.empName.value);
  //   this.empId.reset();
  //   this.empName.reset();
  // }

  public goToQueryParam(employeeId, empName): void {
    if (!employeeId) {
      return;
    }
    this.router.navigate([''], {
      relativeTo: this.route,
      queryParams: {
        empId: employeeId,
        empName: empName
      }
    });
  }

  public submitDropDownForm(): void {
    console.log(this.dropDownFormGroup.value);
    if (this.dropDownFormGroup.invalid) {
      alert('submit form is invalid');
      return;
    }
    if (this.dropDownFormGroup.value.department == '-1') {
      return;
    }
    let formGroupValue = this.dropDownFormGroup.getRawValue();
    if (parseFloat(formGroupValue.numerator) > parseFloat(formGroupValue.denominator)) {
      console.log('numerator should less than or equal to denominator');
      return;
    }
    formGroupValue.enteredBy = this.queryParamsEmpId;
    this.dashboardService.addFormulaStatistics(formGroupValue).subscribe( data => {
      console.log('inserted succesfully');
      alert('Percentage:: ' + data.percentValue);
      this.resetFormGroup();
    }, error => {
      alert('error while inserting the data');
    })
    // this.dropDownFormGroup.reset();
  }
}
