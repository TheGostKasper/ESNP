import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
// import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-solider-types',
    templateUrl: './app.solider.types.html',
    styleUrls: ['./../app.component.css']
})
export class SoliderTypeComponent implements OnInit {
    sTypes = [];
    p: Number = 1;
    curr_sType = {
        _id: '', name: '', describtion: ''
    }
    sType = {
        name: '', describtion: ''
    }
    fields = [{
        name: 'name', nameAR: 'نوع الدرجة', placeholder: 'نوع الدرجة', required: true, id: 'name', type: 'text'
    }]
    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getsTypes();
    }

    getsTypes() {
        this.crudService.get({
            url: 'api/employeeType'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sTypes = res.data;
        });
    }
    addsType(sType) {
        const _sType = { ...sType };
        _sType.created_at = new Date();

        this.crudService.post({
            url: 'api/employeeType',
            body: _sType
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sTypes.push(res.data)
            document.getElementById('cancle').click();
        });
    }
    updatesType(sType) {
        const _sType = { ...sType };
        _sType.updated_at = new Date();
        this.crudService.put({
            url: `api/employeeType/${sType._id}`,
            body: _sType
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(sType) {
        this.curr_sType = sType;
    }
    deletesType() {
        this.crudService.delete({
            url: `api/employeeType/${this.curr_sType._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _sTypes = this.sTypes;
            this.sTypes = _sTypes.filter(e => e._id != this.curr_sType._id);
            document.getElementById('cancleModal').click();
        });
    }
    getsType(_id) {
        this.crudService.get({
            url: `api/employeeType/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
