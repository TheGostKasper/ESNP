import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';

@Component({
    selector: 'app-category',
    templateUrl: './app.category.html',
    styleUrls: ['./../app.component.css']
})
export class CategoryComponent implements OnInit {
    categories = [];
    vacationTypes = []
    curr_category = {
        _id: '', name: ''
    }
    category = {
        name: ''
    }
    p: Number = 1;

    constructor(private crudService: CRUDService) {
    }

    ngOnInit() {
        this.getCategories();
    }
    getCategories() {
        this.crudService.get({
            url: 'api/category'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.categories = res.data;
        });
    }
    addCategory(obj) {
        const _category = { ...obj };
        _category.created_at = new Date();

        this.crudService.post({
            url: 'api/category',
            body: _category
        }).subscribe((res: any) => {
            this.displayError(res);
            if (res.data)
                this.categories.push({ ...res.data })
            document.getElementById('cancleAddition').click();
        });
    }
    updateCategory(obj) {
        let _category = { ...obj };
        _category.updated_at = new Date();

        this.crudService.put({
            url: `api/category/${_category._id}`,
            body: _category
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    confirmSelection(obj) {
        this.curr_category = obj;
    }
    deleteCategory() {
        this.crudService.delete({
            url: `api/category/${this.curr_category._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _categorys = this.categories;
            this.categories = _categorys.filter(e => e._id != this.curr_category._id);
            document.getElementById('cancleModal').click();
        });
    }
    getCategory(_id) {
        this.crudService.get({
            url: `api/category/${_id}`
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }

}
