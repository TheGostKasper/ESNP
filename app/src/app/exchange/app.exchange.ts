import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'app-exchange',
    templateUrl: './app.exchange.html',
    styleUrls: ['./../app.component.css']
})
export class ExchangeComponent implements OnInit {
    exchanges = [];
    curr_exchange = {
        _id: '', name: '', start: '', end: ''
    }
    exchange = {
        name: '', start: '', end: ''
    }

    p: Number = 1;
    constructor(private crudService: CRUDService, private datePipe: DatePipe) {

    }

    ngOnInit() {
        this.getExchange();
    }

    getExchange() {
        this.crudService.get({
            url: 'api/exchange'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.exchanges = res.data;
        });
    }
    addExchange(exchange) {
        const _exchange = { ...exchange };
        _exchange.created_at = new Date();

        this.crudService.post({
            url: 'api/exchange',
            body: _exchange
        }).subscribe((res: any) => {
            this.displayError(res);
            this.exchanges.push(res.data)
            document.getElementById('cancle').click();
        });
    }
    updateExchange(exchange) {
        const _exchange = { ...exchange };
        _exchange.updated_at = new Date();
        this.crudService.put({
            url: `api/exchange/${exchange._id}`,
            body: _exchange
        }).subscribe((res: any) => {
            this.displayError(res);
            document.getElementById('cancleEditable').click();
        });
    }
    
    deleteExchange() {
        this.crudService.delete({
            url: `api/exchange/${this.curr_exchange._id}`,
        }).subscribe((res: any) => {
            this.displayError(res);
            const _exchanges = this.exchanges;
            this.exchanges = _exchanges.filter(e => e._id != this.curr_exchange._id);
            document.getElementById('cancleModal').click();
        });
    }

    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
}
