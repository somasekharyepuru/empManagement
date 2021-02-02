import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../dashboard/dashboard.service';
import { Employee } from '../dashboard/employee.model';

@Component({
  selector: 'app-emp-list',
  templateUrl: './emp-list.component.html',
  styleUrls: ['./emp-list.component.css']
})
export class EmpListComponent implements OnInit {
  empList: Employee[] = [];
  constructor(
    private dashboardService: DashboardService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.employees.subscribe( data => {
      this.empList = data;
    });
  }

  public goToQueryParam(employeeId): void {
    this.router.navigate([''], {
      relativeTo: this.route,
      queryParams: {
        empId: employeeId
      }
    });
  }

}
