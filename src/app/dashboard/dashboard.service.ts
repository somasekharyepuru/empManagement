import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
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
    console.log(formulaObject, 'object here')
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
      console.log(formulaStats, 'formula stats');
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
    return (parseFloat(formulaObject.numerator) / parseFloat(formulaObject.denominator)) * 100;
  }
}
