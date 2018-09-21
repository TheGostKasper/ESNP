import { Component, OnInit } from '@angular/core';
// import { AuthenticationService } from '../services/app.authentication';
import { Encryption } from '../services/encryption';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { CRUDService } from '../services/app.crud';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./../app.component.css']
})
export class ProfileComponent implements OnInit {
    solider: any;
    salaries = [];
    p: Number = 1;
    constructor(private service: CRUDService, private route: ActivatedRoute, private router: Router, private encryption: Encryption) { }
    ngOnInit() {
        this.route.paramMap.pipe(
            switchMap((params: ParamMap) =>
                this.service.get({ url: `api/employee/${params.get('id')}` })
            )).subscribe((res: any) => {
                this.solider = res.data[0];
                // console.log(this.solider);
            });
    }

    getSalaries() {
        if (this.salaries.length == 0) {
            const _pms = { employee: this.solider._id }
            this.service.post({ url: 'api/salary/filterBy', body: _pms }).subscribe((res: any) => {
                this.salaries = res.data;
                this.displayError(res);
            });
        }

    }
    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
}
