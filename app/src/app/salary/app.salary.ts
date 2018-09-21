import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
// import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-salary',
    templateUrl: './app.salary.html',
    styleUrls: ['./../app.component.css']
})
export class SalaryComponent implements OnInit {
    salaries = [];
    curr_salary = {
        _id: '', name: '', paidMoney: ''
    }
    salary = {
        name: '', paidMoney: ''
    }
    p: Number = 1;
    srch: String = "";
    soliders = [];
    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getSalaries();
    }
    filterSoliders() {
        this.crudService.post({
            url: 'api/employee/filter',
            body: { option: { name: this.srch }, selectNumber: 10 }
        }).subscribe((res: any) => {
            this.displayError(res);
            this.soliders = res.data;
            console.log(res.data)
        });
    }
    getSalaries() {
        this.crudService.get({
            url: 'api/salary'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.salaries = res.data;
        });
    }
    addSalary(salary) {
        const _salary = { ...salary };
        _salary.created_at = new Date();

        this.crudService.post({
            url: 'api/salary',
            body: _salary
        }).subscribe((res: any) => {
            this.displayError(res);
            this.salaries.push(res.data)
            document.getElementById('cancle').click();
        });
    }
    updateSalary(salary) {
        const _salary = { ...salary };
        _salary.updated_at = new Date();
        this.crudService.put({
            url: `api/salary/${salary._id}`,
            body: _salary
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(salary) {
        this.curr_salary = salary;
    }
    deleteSalary() {
        this.crudService.delete({
            url: `api/salary/${this.curr_salary._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _salaries = this.salaries;
            this.salaries = _salaries.filter(e => e._id != this.curr_salary._id);
            document.getElementById('cancleModal').click();
        });
    }
    getSalary(_id) {
        this.crudService.get({
            url: `api/salary/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
