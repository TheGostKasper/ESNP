import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
// import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-attendance',
    templateUrl: './app.attendance.html',
    styleUrls: ['./../app.component.css']
})
export class AttendanceComponent implements OnInit {
    attendances = [];
    employees = [];
    f_soliders = [];
    srch = "";
    curr_attendance = {
        _id: '', updated_at: new Date(), available: false, name: '', visitReason: ''
    };
    curr_att = { _id: '' };
    attendance = {
        name: '', visitReason: ''
    }
    p: Number = 1;
    constructor(private crudService: CRUDService) {
    }
    vacations = []
    period = ""
    vprd = "0"
    avb = "0"
    ngOnInit() {
        this.getAttendances();
        this.getEmployees();
        this.getVacations();
    }
    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.employees = res.data;
            this.f_soliders = res.data;
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
    filterSoliders(period) {
        let arr_filter = this.employees;
        this.f_soliders = arr_filter.filter(sol => sol.name.includes(this.srch) || sol.militaryId.includes(this.srch));
        if (this.period !== "") {
            this.f_soliders = this.f_soliders.filter(sol => sol.onDuty === (this.period === "true") ? true : false);
        }
        if (this.vprd !== "0") {
            this.f_soliders = this.f_soliders.filter(sol => sol.vacationPeriod === parseInt(this.vprd));
        }
        if (this.avb !== "0") {
            this.f_soliders = this.f_soliders.filter(sol => sol.available === (this.avb === "true") ? true : false);
        }
    }

    getAttendances() {
        this.crudService.get({
            url: 'api/attendance'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.attendances = res.data;
        });
    }
    addAttendance(attendance) {
        attendance.status = true;
        this.simplifyAddition(attendance);
    }

    simplifyAddition(attendance) {
        const _attendance = attendance;
        _attendance.created_at = new Date();
        _attendance.enterDate = new Date();

        this.crudService.post({
            url: 'api/attendance',
            body: _attendance
        }).subscribe((res: any) => {
            this.displayError(res);
            if (res.data)
                this.attendances.push(res.data)
        });
    }

    updateAttendance(visitReason?: '') {
        const _attendance = { ...this.curr_attendance };

        _attendance.updated_at = new Date();
        _attendance.available = !this.curr_attendance.available;


        this.crudService.put({
            url: `api/employee/${_attendance._id}`,
            body: _attendance
        }).subscribe((res: any) => {
            this.displayError(res);
            this.curr_attendance.available = _attendance.available;
            let obj = { name: _attendance.name, visitReason: visitReason, status: _attendance.available, soliderId: _attendance._id }
            if (obj.status)
                this.simplifyAddition(obj);
            document.getElementById('cancleModal').click();
        });
    }

    updateAttCMV(_attendance) {

        _attendance.updated_at = new Date();
        _attendance.status = !_attendance.status;
        _attendance.leaveDate = new Date();
        this.crudService.put({
            url: `api/attendance/${_attendance._id}`,
            body: _attendance
        }).subscribe((res: any) => {
            this.displayError(res);
            if (_attendance.soliderId) {
                this.curr_attendance.available = !this.curr_attendance.available;
            };
        });
    }


    confirmSelection(attendance) {
        this.curr_attendance = attendance;
    }
    cSelection(attendance) {
        this.curr_att = attendance;
    }
    deleteAttendance() {
        this.crudService.delete({
            url: `api/attendance/${this.curr_att._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _attendances = this.attendances;
            this.attendances = _attendances.filter(e => e._id != this.curr_att._id);
            document.getElementById('caal').click();
        });
    }
    getAttendance(_id) {
        this.crudService.get({
            url: `api/attendance/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
/**
 * Store : The warehouse to store anythings like devices, machines, books  or even food ....
 * each itme must have these properties => name , sectionId , description , image , amount , price , notes , status
 * 
 * Another thing we have to mind that we have to categorized all items thu (Categories , SubCategories)  
 * 
 */