import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CRUDService } from '../services/app.crud';
import { Encryption } from '../services/encryption';


let $: any;

@Component({
    selector: 'app-employee',
    templateUrl: './app.employee.html',
    styleUrls: ['./../app.component.css']
})
export class employeeComponent implements OnInit {
    p: number = 1;
    employees = [];
    f_soliders = [];
    sections = [];
    sTypes = [];
    vacations = []
    vacationsType = []
    curr_employee = {
        _id: '', name: '', address: '', password: '', email: '', phone: '',
        militaryId: '', leaveDate: '', image: '', rate: '',
        onDuty: '', empType: '', vacationPeriod: '', joinDate: '',
        numberServices: 1, extraServices: 0, section: { _id: '', name: '' }, vacation: { _id: '', name: '' }
    }
    employee = {
        name: '', address: '', password: '', email: '', phone: '',
        military: '', leaveDate: '', image: '', rate: 5,
        onDuty: '', empType: '', section: { _id: '', name: '' }, vacation: { _id: '', name: '' }
    }
    sec_obj = { _id: '', name: '' }
    srch: String = "";
    period: String = "";
    salary: any = { name: '', paidMoney: 0 };
    vprd: string = "0";
    dutiable: string = "0";
    avb: string = "0";
    constructor(private crudService: CRUDService, private encryption: Encryption, private datePipe: DatePipe) {
    }


    ngOnInit() {

        this.getEmployees();
        this.getsTypes();
        this.getSections();
        this.getVacations();
        this.getVacationsType();
    }


    updateSoliders() {
        this.f_soliders.filter(e => !e.dutiable).map(e => this.crudService.put({
            url: `api/employee/${e._id}`,
            body: { vacation: '5bb7365033f9eb1dc8fbf297' }
        }).subscribe((res: any) => {
            this.displayError(res);
        }))
    }




    applyPromise(_url) {
        return this.crudService.get({
            url: _url
        });
    }
    getsTypes() {
        this.applyPromise('api/employeeType').subscribe((res: any) => {
            if (res.err) return res;
            else this.sTypes = res.data;
        });
    }
    getSections() {
        this.applyPromise('api/section').subscribe((res: any) => {
            if (res.err) return res;
            else this.sections = res.data;
        });
    }
    getVacationsType() {
        this.crudService.get({
            url: 'api/vacationType'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacationsType = res.data;
        });
    }
    getVacations() {
        this.crudService.get({
            url: 'api/vacation'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacations = res.data;
        });
    }
    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.employees = res.data;
            this.f_soliders = res.data;
            // this.insertEmps();
            // this.updateSoliders();
        });
    }
    addEmployee(employee) {
        const _employee = { ...employee };
        _employee.created_at = new Date();
        _employee.onDuty = false;
        _employee.available = true;
        _employee.dutiable = true;
        _employee.extraServices = 0;
        _employee.password = this.encryption.b64EncodeUnicode(employee.password);

        this.crudService.post({
            url: 'api/employee',
            body: _employee
        }).subscribe((res: any) => {
            this.displayError(res);
            this.f_soliders.push(res.data)
            document.getElementById('cancelED').click();
        });
    }
    updateEmployee(employee) {
        const _employee = { ...employee };
        
        let vacation = this.vacationsType.filter(e => employee.vacation._id === e._id)[0]
        let section = this.sections.filter(e => employee.section._id === e._id)[0]

        _employee.updated_at = new Date();
        this.crudService.put({
            url: `api/employee/${employee._id}`,
            body: _employee
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
            if (this.curr_employee.section._id) {
                this.curr_employee.section = {...section};
                this.curr_employee.vacation = { ...vacation };
            }
        });
    }
    confirmSelection(employee) {
        this.curr_employee = employee;
        this.curr_employee.joinDate = this.convertDate(employee.joinDate)
        this.curr_employee.leaveDate = this.convertDate(employee.leaveDate)
    }
    addSalary(salary) {
        const _salary = { ...salary };
        _salary.created_at = new Date();
        _salary.month = new Date();
        _salary.employee = this.curr_employee._id;
        this.crudService.post({
            url: 'api/salary',
            body: _salary
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('clsa').click();
        });
    }

    convertDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd')
    }
    deleteEmployee() {
        this.crudService.delete({
            url: `api/employee/${this.curr_employee._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            this.f_soliders = this.f_soliders.filter(e => e._id != this.curr_employee._id);
            document.getElementById('cancleModal').click();
        });
    }
    getEmployee(_id) {
        this.crudService.get({
            url: `api/employee/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }



    filterSoliders() {
        let arr_filter = this.employees;
        this.f_soliders = arr_filter.filter(sol => sol.name.includes(this.srch) || sol.militaryId.includes(this.srch));
        if (this.period !== "") {
            this.f_soliders = this.f_soliders.filter(sol => sol.onDuty === (this.period === "true") ? true : false);
        }
        if (this.vprd !== "0") {
            this.f_soliders = this.f_soliders.filter(sol => sol.vacation._id === this.vprd);
        }
        if (this.avb !== "0") {
            this.f_soliders = this.f_soliders.filter(sol => sol.available === (this.avb === "true") ? true : false);
        }
        if (this.dutiable !== "0") {
            this.f_soliders = this.f_soliders.filter(sol => sol.dutiable === (this.dutiable === "true") ? true : false);
        }
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
    insertEmps() {

        // this.f_soliders.filter(e => e.vacation === null).map(e => this.crudService.put({
        //     url: `api/employee/${e._id}`,
        //     body: { vacation: "5bb756ab613ffb18a421f75d" }
        // }).subscribe((res: any) => {
        //     this.displayError(res);
        // }));


        // this.crudService.get({
        //     url: `api/exchange`
        // }).subscribe((res: any) => {
        //     res.data.map(e => this.crudService.delete({
        //         url: `api/exchange/${e._id}`
        //     }))
        // });
        // for (let index = 0; index < 3; index++) {
        //     try {
        //         let emp = {
        //             name: `albert ${index}`, address: `random address for albert ${index}`, password: `123${index}`, email: `fed${index}@gmail.com`, phone: `0102585${index}`,
        //             militaryId: `20188945${index}`, leaveDate: new Date(), dateOfBirth: new Date(), empType: 'جندي', joinDate: new Date()
        //         }
        //         this.addEmployee(emp);
        //     } catch (error) {
        //         console.log(error);
        //     }
        // }
    }
}
