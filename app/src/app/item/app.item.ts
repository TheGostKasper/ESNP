import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';

@Component({
    selector: 'app-item',
    templateUrl: './app.item.html',
    styleUrls: ['./../app.component.css']
})
export class ItemComponent implements OnInit {
    items = []
    f_items = []
    sections = []
    subCategories = []
    obj_glob = {
        barcode: '', name: '', subCategory: { _id: '', name: '' }, section: { _id: '', name: '' }
    }
    curr_item = { _id: '', ...this.obj_glob }

    item = { ...this.obj_glob }
    sec_Id = ''
    srch = ''
    subCat_Id = ''
    p: Number = 1

    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getItems();
        this.getSections();
        this.getSubCategories();
    }
    getSections() {
        this.crudService.get({
            url: 'api/section'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.sections = res.data;
        });
    }
    getSubCategories() {
        this.crudService.get({
            url: 'api/subCategory'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.subCategories = res.data;
        });
    }
    getItems() {
        this.crudService.get({
            url: 'api/item'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.items = res.data;
            this.f_items = res.data;
        });
    }
    filterItems() {
        this.f_items = this.items.filter(sol => sol.name.includes(this.srch) || sol.barcode.includes(this.srch));
        if (this.sec_Id !== "") {
            this.f_items = this.f_items.filter(sol => sol.section._id === this.sec_Id);
        }
        if (this.subCat_Id !== "") {
            this.f_items = this.f_items.filter(sol => sol.subCategory._id === this.subCat_Id);
        }
    }
    addItem(obj) {
        const _item = { ...obj };
        _item.created_at = new Date();
        this.crudService.post({
            url: 'api/item',
            body: _item
        }).subscribe((res: any) => {
            this.displayError(res);
            if (res.data)
                this.f_items.push({ ...res.data })
            document.getElementById('cancleAddition').click();
        });
    }
    updateItem(obj) {
        let _item = { ...obj };
        _item.updated_at = new Date();
        let sec_results = this.sections.filter(e => _item.section._id === e._id)[0]
        let results = this.subCategories.filter(e => _item.subCategory._id === e._id)[0]

        this.crudService.put({
            url: `api/item/${_item._id}`,
            body: _item
        }).subscribe((res: any) => {
            this.displayError(res);
            obj.subCategory = { ...results };
            obj.section = { ...sec_results };

            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(obj) {
        this.curr_item = obj;
    }
    deleteitem() {
        this.crudService.delete({
            url: `api/item/${this.curr_item._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _items = this.items;
            this.f_items = _items.filter(e => e._id != this.curr_item._id);
            document.getElementById('cancleModal').click();
        });
    }
    getitem(_id) {
        this.crudService.get({
            url: `api/item/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) {
            alert('Something went wrong, try again later');
            console.log(res.err);

        }
        else console.log(res.message);
    }

}
