import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Employee } from './employee.model';
import { FormulaValue } from './formula_entry.cnst';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  employees = new BehaviorSubject<Employee[]>([]);
  formulaStats = {};
  constructor() {
    if (localStorage.getItem('empTable')) {
      this.employees.next(JSON.parse(localStorage.getItem('empTable')));
    }
    if (localStorage.getItem('formulaObject')) {
      this.formulaStats = JSON.parse(localStorage.getItem('formulaObject'));
    }
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

  public addFormulaStatistics(formulaObject: FormulaValue): void {
    let dummyFormulaObject: any = formulaObject;
    if (!this.formulaStats[formulaObject.formulaValue]) {
      this.formulaStats[formulaObject.formulaValue] = {};
    }
    let dateObject = new Date(formulaObject.insertedDate);
    let dateString = dateObject.getFullYear() + '-' + dateObject.getMonth() + '-' + dateObject.getDate();
    dummyFormulaObject.percentValue = this.getPercentageValue(dummyFormulaObject);
    this.formulaStats[formulaObject.formulaValue][dateString] = dummyFormulaObject;
    localStorage.setItem('formulaObject', JSON.stringify(this.formulaStats));
    console.log(this.formulaStats, 'this.formulaStats');
  }

  private getPercentageValue(formulaObject: FormulaValue): number {
    return (parseFloat(formulaObject.numerator) / parseFloat(formulaObject.denominator)) * 100;
  }
}
