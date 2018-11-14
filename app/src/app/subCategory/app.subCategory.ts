import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';

@Component({
    selector: 'app-subCategory',
    templateUrl: './app.subCategory.html',
    styleUrls: ['./../app.component.css']
})
export class SubCategoryComponent implements OnInit {
    subCategories = [];
    categories = []
    curr_subCategory = {
        _id: '', name: '', category: { _id: '', name: '' }
    }
    subCategory = {
        name: '', category: { _id: '', name: '' }
    }
    p: Number = 1;

    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getCategories();
        this.getSubCategories();
    }
    getCategories() {
        this.crudService.get({
            url: 'api/category'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.categories = res.data;
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
    addSubCategory(obj) {
        const _subCategory = { ...obj };
        _subCategory.created_at = new Date();

        this.crudService.post({
            url: 'api/subCategory',
            body: _subCategory
        }).subscribe((res: any) => {
            this.displayError(res);
            if (res.data)
                this.subCategories.push({ ...res.data })
            document.getElementById('cancleAddition').click();
        });
    }
    updateSubCategory(obj) {
        let _subCategory = { ...obj };
        _subCategory.updated_at = new Date();
        let results = this.categories.filter(e => _subCategory.category._id === e._id)[0]

        this.crudService.put({
            url: `api/subCategory/${_subCategory._id}`,
            body: _subCategory
        }).subscribe((res: any) => {
            this.displayError(res);
            obj.category = { ...results };

            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(obj) {
        this.curr_subCategory = obj;
    }
    deleteSubCategory() {
        this.crudService.delete({
            url: `api/subCategory/${this.curr_subCategory._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _subCategorys = this.subCategories;
            this.subCategories = _subCategorys.filter(e => e._id != this.curr_subCategory._id);
            document.getElementById('cancleModal').click();
        });
    }
    getSubCategory(_id) {
        this.crudService.get({
            url: `api/subCategory/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
