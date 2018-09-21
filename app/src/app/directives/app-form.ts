import { Directive, Input, Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'ns-root',
    templateUrl: './app-form.html',
    styleUrls: ['./../app.component.css']
})
export class ValidateComponent {

    @Input() fields: any;
    ret_obj: any;
    @Output('nelected') emitter = new EventEmitter<any>();

    nelected(value) {
        this.ret_obj = value;
        this.clearValues();
        this.emitter.emit(this.ret_obj);
    }
    constructor() {
    }

    clearValues() {
        this.fields.forEach(element => {
           // window.document.getElementById(element.id).value = '';
        });
    }



}