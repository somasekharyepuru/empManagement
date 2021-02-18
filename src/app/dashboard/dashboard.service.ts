import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { KPIFixedValues, kpiMultiplicationFactory } from './dropdonw_values.cnst';
import { Employee } from './employee.model';
import { kpiValue } from './formula_entry.cnst';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  employees = new BehaviorSubject<Employee[]>([]);
  apiUrl = 'http://localhost:3000';
  constructor(
    private http: HttpClient
  ) {
  }

  public getEmployess(): Employee[] {
    return JSON.parse(localStorage.getItem('empTable'));
  }

  public addEmployee(id: string, name: string): void {
    const employee: Employee = {
      id,
      name
    };
    let employes = this.getEmployess() || [];
    employes.push(employee);
    localStorage.setItem('empTable', JSON.stringify(employes));
    this.employees.next(employes);
  }

  public verifyUserExistOrNot(id: string): boolean {
    const employes = this.getEmployess();
    if (!employes) {
      return false;
    }
    if (employes.length === 0) {
      return false;
    }
    const filteredElements = employes.filter( value => value.id === id);
    if (filteredElements.length === 0) {
      return false;
    } else {
      return true;
    }
  }

  public addFormulaStatistics(formulaObject: kpiValue): Observable<any> {
    let formulaStats: any = {};
    return new Observable( observer => {
      let dummyFormulaObject: any = formulaObject;
      if (!formulaStats[formulaObject.kpiValue]) {
        formulaStats[formulaObject.kpiValue] = {};
      }
      let dateObject = new Date(formulaObject.insertedDate);
      let dateString = dateObject.getFullYear() + '-' + dateObject.getMonth() + '-' + dateObject.getDate();
      dummyFormulaObject.percentValue = this.getPercentageValue(dummyFormulaObject);
      dummyFormulaObject.dateString = dateString;
      this.http.post(this.apiUrl + '/kpiValues', dummyFormulaObject).subscribe( data => {
        observer.next(data);
        observer.complete();
      }, error => {
        observer.error(error);
        observer.complete();
      })
    })
  }

  private getPercentageValue(formulaObject: kpiValue): number {
    const multiplicationFactor = kpiMultiplicationFactory[formulaObject.kpiValue] || 100;
    return (parseFloat(formulaObject.numerator) / parseFloat(formulaObject.denominator)) * multiplicationFactor;
  }

  public getValuesForKPI(kpiName): Observable<any> {
    const kpiValues: any = Object.assign({}, KPIFixedValues[kpiName]);
    return new Observable( observer => {
      this.http.get(this.apiUrl + '/kpiValues').subscribe( (data: any[]) => {
        data.forEach( value => {
          if (value.kpiValue === kpiName) {
            kpiValues[this.getDateString(value.dateString)] = value.percentValue;
          }
        })
        observer.next(kpiValues);
        observer.complete();
      }, error => {
        observer.next({});
        observer.complete();
      })
    })
  }

  private getDateString(date) {
    let monthList = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let dateValue = date.split('-');
    return monthList[dateValue[1]] +' -'+ dateValue[0];
  }

}
