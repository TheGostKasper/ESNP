import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
// import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
    selector: 'app-section',
    templateUrl: './app.section.html',
    styleUrls: ['./../app.component.css']
})
export class SectionComponent implements OnInit {
    sections = [];
    curr_section = {
        _id: '', name: '', describtion: ''
    }
    section = {
        name: '', describtion: ''
    }
    p: Number = 1;
    fields = [{
        name: 'name', nameAR: 'اسم المحور', placeholder: 'اسم المحور', required: true, id: 'name', type: 'text'
    },
    {
        name: 'describtion', nameAR: 'وصف المحور', placeholder: 'وصف المحور', required: true, id: 'describtion', type: 'text'
    },
    {
        name: 'rate', nameAR: 'تقييم المحور', placeholder: 'تقيم المحور', required: true, id: 'rate', type: 'text'
    }
        // {
        //     name: 'options',nameAR:'اختيارات', placeholder: '', required: true, values: ['manga', 'mubo', 'abi'], id: 'gun_id', type: 'select'
        // }
    ]
    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getSections();
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
            document.getElementById('cancle').click();
        });
    }
    updateSection(section) {
        const _section = { ...section };
        _section.updated_at = new Date();
        this.crudService.put({
            url: `api/section/${section._id}`,
            body: _section
        }).subscribe((res: any) => {
            this.displayError(res);
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
