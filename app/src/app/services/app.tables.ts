import { Injectable } from '@angular/core';
import { CRUDService } from '../services/app.crud';

import 'rxjs/add/operator/map';


@Injectable()
export class TablesService {


    constructor(
        private crudService: CRUDService
    ) { }
    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
    getVacations() {
       return this.crudService.get({
            url: 'api/vacation'
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }
    getSections() {
        return this.crudService.get({
            url: 'api/section'
        }).subscribe((res: any) => {
            this.displayError(res);
            return res.data;
        });
    }
    getserviceAreas() {
        this.crudService.get({
            url: 'api/serviceArea'
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }
    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }
    getDists() {
        this.crudService.get({
            url: 'api/distribute'
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }
}
