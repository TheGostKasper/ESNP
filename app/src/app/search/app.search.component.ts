import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
import { DatePipe } from '@angular/common';
// import * as _ from 'lodash';

@Component({
    selector: 'app-search',
    templateUrl: './app.search.component.html',
    styleUrls: ['./app.search.component.css']
})
export class SearchComponent implements OnInit {
    sections = [];
    vacations = [];
    employees = [];
    arr_obj = [];
    f_soliders = [];
    sys_period = 0;
    period = 0;
    prv_period = 0;
    srch: String = "";
    solider = [];
    sol_filter = [];
    p = 0;
    constructor(private crudService: CRUDService, private datePipe: DatePipe) {

    }

    ngOnInit() {
        this.getVacations();
        this.getEmployees();
        this.getSections();
    }
    getVacations() {
        this.crudService.get({
            url: 'api/vacation'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacations = res.data;
        });
    }
    changeSystem(period) {
        this.sol_filter = this.employees.filter(sol => sol.vacationPeriod === parseInt(period));
    }
    getData() {
        this.arr_obj = this.cmbEmployees();
    }
    filterSoliders(period) {
        let arr_filter = this.employees;
        this.f_soliders = arr_filter.filter(sol => sol.name.includes(this.srch) || sol.militaryId.includes(this.srch));
        if (this.period > 0) {
            this.f_soliders = ((this.srch !== "") ? this.f_soliders : arr_filter).filter(sol => sol.vacationPeriod === parseInt(period));
        }
    }
    periodicVacation() {
        let _arr = (this.arr_obj.length > 0) ? this.arr_obj : this.cmbEmployees();
        _arr.map(arr => {
            for (let index = 0; index < this.sys_period; index++) {
                let indx = arr.employees.length / this.sys_period;
                console.log(indx);
                arr.employees.slice(index * indx, indx * (index + 1)).map(ele => {
                    ele.vacationPeriod = index;
                    this.updateEmployeeVacation(index + 1, ele);
                });
            }
        });
        alert('تم التوزيع');
    }


    prvApply(period) {
        this.employees
            .filter(e => e.vacationPeriod == parseInt(period))
            .map(e => this.updateEmployeeAvailability(e, false));

        this.employees
            .filter(e => e.vacationPeriod !== parseInt(period))
            .map(e => this.updateEmployeeAvailability(e, true));
        alert('تم التوزيع');


    }

    updateEmployeeVacation(index, emp) {
        this.updateEmp(emp._id, { vacationPeriod: index, updated_at: new Date() })
    }
    updateEmployeeAvailability(emp, status) {
        this.updateEmp(emp._id, { available: status, updated_at: new Date() })
    }
    updateEmp(_id, body) {
        this.crudService.put({
            url: `api/employee/${_id}`,
            body: body
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }
    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

    applyPromise(_url) {
        return this.crudService.get({
            url: _url
        });
    }
    getSections() {
        this.applyPromise('api/section').subscribe((res: any) => {
            this.displayError(res);
            this.sections = res.data;
        });
    }
    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.employees = res.data;

            console.log(this.employees.length);
        });
    }
    cmbEmployees() {
        return this.sections.map(sec => {
            return {
                section: sec,
                employees: this.employees.filter(sol => sol.section && sol.section._id === sec._id)
            }
        });
    }
}