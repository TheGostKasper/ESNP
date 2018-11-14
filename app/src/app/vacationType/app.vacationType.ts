import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-vacationType',
    templateUrl: './app.vacationType.html',
    styleUrls: ['./../app.component.css']
})
export class VacationTypeComponent implements OnInit {
    vacations = [];
    curr_vacation = {
        _id: '', name: '', start: '', end: ''
    }
    vacation = {
        name: '', start: '', end: ''
    }
    fields = [{
        name: 'name', nameAR: 'نوع الاجازة', placeholder: 'نوع الاجازة', required: true, id: 'name', type: 'text'
    }, {
        name: 'durationCount', nameAR: 'عدد الدفعات', placeholder: 'عدد دفعات الاجازة', required: true, id: 'durationCount', type: 'number'
    }
    ]

    p: Number = 1;
    constructor(private crudService: CRUDService, private datePipe: DatePipe) {

    }

    ngOnInit() {
        this.getVacations();
    }

    getVacations() {
        this.crudService.get({
            url: 'api/vacationType'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacations = res.data;
        });
    }
    addVacation(vacation) {
        const _vacation = { ...vacation };
        _vacation.created_at = new Date();

        this.crudService.post({
            url: 'api/vacationType',
            body: _vacation
        }).subscribe((res: any) => {
            this.displayError(res);
            console.log(res.data);
            this.vacations.push(res.data)
            document.getElementById('cancle').click();
        });
    }
    updateVacation(vacation) {
        const _vacation = { ...vacation };
        _vacation.updated_at = new Date();
        this.crudService.put({
            url: `api/vacationType/${vacation._id}`,
            body: _vacation
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(vacation) {
        this.curr_vacation = vacation;
    }
    deleteVacation() {
        this.crudService.delete({
            url: `api/vacationType/${this.curr_vacation._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _vacations = this.vacations;
            this.vacations = _vacations.filter(e => e._id != this.curr_vacation._id);
            document.getElementById('cancleModal').click();
        });
    }
    getVacation(_id) {
        this.crudService.get({
            url: `api/vacationType/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
}
