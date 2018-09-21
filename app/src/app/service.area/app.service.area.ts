import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
import * as _ from 'lodash';

@Component({
    selector: 'app-service-area',
    templateUrl: './app.service.area.html',
    styleUrls: ['./../app.component.css']
})
export class ServiceAreaComponent implements OnInit {
    sareas = [];
    curr_sarea = {
        _id: '', name: '', gun_id: '', difficulty: 5, describtion: ''
    }
    sarea = {
        name: '', gun_id: ''
    }
    fields = [{
        name: 'name', nameAR: 'اسم الخدمة', placeholder: 'اسم الخدمة', required: true, id: 'name', type: 'text'
    },
    {
        name: 'describtion', nameAR: 'وصف الخدمة', placeholder: 'وصف نوع الخدمة', required: true, id: 'describtion', type: 'text'
    },
    {
        name: 's_count', nameAR: 'عدد الجنود', placeholder: 'عدد الجنود في الخدمة', required: true, id: 's_count', type: 'number'
    },
    {
        name: 'difficulty', nameAR: 'مدي الصعوبة', placeholder: 'تقيم صعوبة الخدمة', required: true, id: 'difficulty', type: 'text'
    },
    {
        name: 'gun_id', nameAR: 'رقم السلاح', placeholder: 'رقم السلاح', required: true, id: 'gun_id', type: 'text'
    },
    {
        name: 'priority', nameAR: 'ترتيب الاهمية', placeholder: 'ترتيب الاهمية', required: true, id: 'priority', type: 'number'
    }
    ]
    availableServingAreas = []
    availableSoliders = []
    soliderOnDuty = []
    soliderOnRest = []
    servingSoliders = []
    stay_still = false;
    p: Number = 1;
    di: Number = 1;

    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getserviceAreas();

    }
    getserviceAreas() {
        this.crudService.get({
            url: 'api/serviceArea'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sareas = res.data;
            this.availableServingAreas = res.data;
        });
    }
    addserviceArea(sarea) {
        const _serviceArea = { ...sarea };
        _serviceArea.created_at = new Date();

        this.crudService.post({
            url: 'api/serviceArea',
            body: _serviceArea
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sareas.push(res.data)
            document.getElementById('cancle').click();
        });
    }
    updateserviceArea(serviceArea) {
        const _serviceArea = { ...serviceArea };
        _serviceArea.updated_at = new Date();
        this.crudService.put({
            url: `api/serviceArea/${serviceArea._id}`,
            body: _serviceArea
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(serviceArea) {
        this.curr_sarea = serviceArea;
    }
    deleteserviceArea() {
        this.crudService.delete({
            url: `api/serviceArea/${this.curr_sarea._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _serviceAreas = this.sareas;
            this.sareas = _serviceAreas.filter(e => e._id != this.curr_sarea._id);
            document.getElementById('cancleModal').click();
        });
    }
    getserviceArea(_id) {
        this.crudService.get({
            url: `api/serviceArea/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }


   
}
