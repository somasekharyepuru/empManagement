import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as Highcharts from 'highcharts';
import HC_exporting from 'highcharts/modules/exporting';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { DepartmentValues } from 'src/app/dashboard/department_roles.cnst';
import { AuthService } from 'src/app/services/auth.service';
HC_exporting(Highcharts);

const Boost = require('highcharts/modules/boost');
const noData = require('highcharts/modules/no-data-to-display');
const More = require('highcharts/highcharts-more');
const threed = require('highcharts/highcharts-3d');
Boost(Highcharts);
More(Highcharts);
noData(Highcharts);
threed(Highcharts);
@Component({
  selector: 'app-chart-component',
  templateUrl: './chart-component.component.html',
  styleUrls: ['./chart-component.component.css']
})
export class ChartComponentComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  showChart = false;
  updateChart = false;
  chartOptions: any = {
    chart: {
        type: 'column'
    },
    title: {
        text: 'KPI Trends'
    },
    subtitle: {
        text: 'Source: Leelavathi Hospitals'
    },
    xAxis: {
        categories: [
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: 'Percentage'
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: '',
        data: []
    }]
  };
  actualChartOptions = JSON.parse(JSON.stringify(this.chartOptions));
  activeKpi: string;
  userInfo: any;
  availabledepartments = JSON.parse(JSON.stringify(DepartmentValues));
  kpiDropdownValues: any = {};
  getHeaders = Object.keys;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {

  }

  ngOnInit(): void {
    this.userInfo = this.authService.getUserDetails();
    this.kpiDropdownValues = this.availabledepartments[this.userInfo.role].kpiValues;
    this.route.queryParams.subscribe( params => {
      if (params.kpi === undefined || params.kpi === null) {
        if (this.kpiDropdownValues) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              kpi : Object.keys(this.kpiDropdownValues)[0]
            }
          })
        }
      } else {
        this.activeKpi = params.kpi;
        if (this.activeKpi != '-1') {
          this.intiComponent();
        }
      }
    })
  }

  private intiComponent() {
    this.showChart = false;
    this.actualChartOptions = JSON.parse(JSON.stringify(this.chartOptions));
    this.dashboardService.getValuesForKPI(this.activeKpi).subscribe( data => {
      if (data) {
        this.actualChartOptions.xAxis.categories = Object.keys(data);
        this.actualChartOptions.series[0].name = this.kpiDropdownValues[this.activeKpi].title;
        this.actualChartOptions.series[0].data = Object.values(data);
        this.showChart = true;
      }
      // console.log(this.actualChartOptions, this.sampleChartOptions, 'cahr options here')
    })

  }

  public changeKpi() {
    this.router.navigate([],  {
      relativeTo: this.route,
      queryParams: {
        kpi: this.activeKpi
      }
    })
  }

}
