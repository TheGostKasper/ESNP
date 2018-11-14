import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';

@Component({
    selector: 'app-section',
    templateUrl: './app.section.html',
    styleUrls: ['./../app.component.css']
})
export class SectionComponent implements OnInit {
    sections = [];
    vacationTypes = []
    obj_glob = {
        _id: '', name: '', describtion: '', vacationType: { _id: '', name: '' }
    }
    curr_section = { _id: '', ...this.obj_glob }
    section = { ...this.obj_glob }
    
    p: Number = 1;

    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getSections();
        this.getVacationTypes();
    }
    getVacationTypes() {
        this.crudService.get({
            url: 'api/vacationType'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacationTypes = res.data;
        });
    }
    getSections() {
        this.crudService.get({
            url: 'api/section'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sections = res.data;
        });
    }
    addSection(section) {
        const _section = { ...section };
        _section.created_at = new Date();

        this.crudService.post({
            url: 'api/section',
            body: _section
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sections.push(res.data)
            document.getElementById('cancleAddition').click();
        });
    }
    updateSection(section) {
        let _section = { ...section };
        let results = this.vacationTypes.filter(e => _section.vacationType._id === e._id)[0]

        _section.updated_at = new Date();

        this.crudService.put({
            url: `api/section/${_section._id}`,
            body: _section
        }).subscribe((res: any) => {
            this.displayError(res);
            section.vacationType = { ...results };
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(section) {
        this.curr_section = section;
    }
    deleteSection() {
        this.crudService.delete({
            url: `api/section/${this.curr_section._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _sections = this.sections;
            this.sections = _sections.filter(e => e._id != this.curr_section._id);
            document.getElementById('cancleModal').click();
        });
    }
    getSection(_id) {
        this.crudService.get({
            url: `api/section/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
