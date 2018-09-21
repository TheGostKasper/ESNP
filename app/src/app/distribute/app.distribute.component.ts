import { Component, OnInit } from '@angular/core';
import { CRUDService } from '../services/app.crud';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-distribute-area',
    templateUrl: './app.distribute.component.html',
    styleUrls: ['./../app.component.css']
})
export class DistributeComponent implements OnInit {
    availableServingAreas = []
    // availableSoliders = []
    soliderOnDuty = []
    soliderOnRest = []
    ctrSrvs = []
    dists = []
    fdists = []
    sections = []
    arr_obj = []
    soliders_arr = []
    vacations = []
    _prds = []
    sys_period = 0;
    period = 0;
    prv_period = 0;
    srchSoliders = []
    curr_sol_rplc: any;
    p: Number = 1

    constructor(private crudService: CRUDService, private datePipe: DatePipe) {
    }
    fdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    ngOnInit() {
        this.getserviceAreas();
        this.getEmployees();
        this.getSections();
        this.getVacations();
    }
    getVacations() {
        this.crudService.get({
            url: 'api/vacation'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacations = res.data;
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
    getserviceAreas() {
        this.crudService.get({
            url: 'api/serviceArea'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.availableServingAreas = res.data;
        });
    }
    sol_splice_no: number = 4;
    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.soliders_arr = res.data;

            let availableSoliders = res.data.filter(e => e.available === true);
            this.sol_splice_no = availableSoliders.filter(ele => ele.onDuty).length - availableSoliders.filter(ele => !ele.onDuty).length;
        });
    }
    getDists() {
        this.crudService.get({
            url: 'api/distribute'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.dists = res.data;
            this.fdists = res.data;
        });
    }
    save: Boolean = false;
    distribute() {

        let _arr = this.soliders_arr.filter(e => e.available === true);
        this.soliderOnDuty = _arr.filter(ele => ele.onDuty);
        this.soliderOnRest = _arr.filter(ele => !ele.onDuty);

        this.srchSoliders = _arr;// (this.soliderOnRest.length > 0) ? this.soliderOnRest : this.soliderOnDuty;

        this.ctrSrvs = [];
        this.availableServingAreas.map((sa, i) => {
            let solds = [];
            for (let index = 0; index < sa.s_count; index++) {
                const element = sa;
                let sol = this.assignToSolider(element, index);
                solds.push(sol);
            }
            this.ctrSrvs.push({
                srvSec: sa,
                srvSolds: solds
            });
        });
        this.save = true;
    }

    assignToSolider(sa, shift) {
        const solider = this.getSolider();
        solider.extra.shiftAreas = { serviceArea: sa.name, shiftNumber: shift, distDate: new Date() };
        this.soliderOnRest = this.soliderOnRest.filter(ele => ele._id != solider._id);
        this.soliderOnDuty = this.soliderOnDuty.filter(ele => ele._id != solider._id);
        return solider;
    }

    getSolider() {
        let arr = (this.soliderOnRest.length > 0) ? this.soliderOnRest : this.soliderOnDuty.sort(e => e.extra.shiftAreas.length)//.splice(0, this.sol_splice_no);
        const indx = Math.floor(Math.random() * arr.length);
        return arr[indx];
    }

    saveChanges() {
        let ctrSrvs = this.ctrSrvs;
        let _arr = [];
        ctrSrvs.map((srvs) => {
            let _obj = { srvAre: srvs.srvSec.name, srcSolds: srvs.srvSolds.map(sold => { return { _id: sold._id, name: sold.name } }) };
            _arr.push(_obj);
        });
        this.addDistribution(_arr);
        this.updateSoliders();
        
    }
    filterSoliders(srch) {
        let arr_filter = this.soliders_arr.filter(e => e.available === true && e.onDuty);
        this.srchSoliders = arr_filter.filter(sol => sol.name.includes(srch) || sol.militaryId.includes(srch));
    }
    rplcSoliders = []
    prSoliders(srch) {
        let arr_filter = this.soliders_arr.filter(e => e.available === true && e.section.name === this.curr_sdu.curr_sol.section.name);
        this.rplcSoliders = arr_filter.filter(sol => sol.name.includes(srch) || sol.militaryId.includes(srch));
    }
    curr_sdu: any = {
        curr_sec: {},
        curr_sol: {}
    }
    replace_target(sdu, sol) {
        this.curr_sdu = {
            curr_sec: sdu.srvSec,
            curr_sol: sol
        };
    }

    curr_sol_destination(sol) {
        this.curr_sol_rplc = sol;
    }
    replace_destination() {
        this.ctrSrvs
            //.filter(ctr => ctr.srvSec.name === this.curr_sdu.curr_sec.name)
            .map((e) => {
                let arr = e.srvSolds;
                let trgs = arr.filter(srs => srs.militaryId === this.curr_sdu.curr_sol.militaryId)[0];
                let replace = arr.filter(srs => srs.militaryId === this.curr_sol_rplc.militaryId)[0];


                let index_target = arr.indexOf(trgs);
                let index_replace = arr.indexOf(replace);

                let rplc = { ...this.curr_sol_rplc };
                let trg = { ...this.curr_sdu.curr_sol };


                rplc.extra = this.curr_sdu.curr_sol.extra;
                trg.extra = this.curr_sol_rplc.extra;

                if (index_target >= 0) {
                    arr.splice(index_target, 1, rplc);
                }

                if (index_replace >= 0) {
                    arr.splice(index_replace, 1, trg);
                }


                e.srvSolds = arr;
                document.getElementById('cancleModal').click();

            })

    }

    addDistribution(_arr) {
        let obj = { soliders: _arr, created_at: new Date() }
        this.crudService.post({
            url: `api/distribute`,
            body: obj
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    updateSoliders() {
        let ctrSrvs = this.ctrSrvs;
        ctrSrvs.map((srvs) => srvs.srvSolds.map(sol => this.updtSra(sol, true)));
        this.soliderOnDuty.map(sol => this.updateEmp(sol._id, { onDuty: false, updated_at: new Date() }));
        this.save = false;
        alert('تم الحفظ')
    }
    updtSra(employee, status) {
        const _employee = { ...employee };
        _employee.updated_at = new Date();
        this.crudService.post({
            url: `api/employee/shiftAreas/${employee._id}`,
            body: _employee
        }).subscribe((res: any) => {
            this.displayError(res);
            this.updateEmp(employee._id, { onDuty: status, updated_at: new Date() });
        });
    }

    updateEmp(_id, body) {
        if (body.onDuty != undefined) {
            this.soliders_arr.filter(e => e.available === true && e._id === _id).map(e => e.onDuty = body.onDuty);
        }
        this.crudService.put({
            url: `api/employee/${_id}`,
            body: body
        }).subscribe((res: any) => {
            this.displayError(res);
        });
    }

    updateEmployeeAvailability(emp, status) {
        this.updateEmp(emp._id, { available: status, updated_at: new Date() })
    }

    cmbEmployees() {
        return this.sections.map(sec => {
            return {
                section: sec,
                employees: this.soliders_arr.filter(sol => sol.section && sol.section._id === sec._id)
            }
        });
    }
    prdc_vct = []
    periodicVacation() {
        let _arr = this.cmbEmployees();
        _arr.map(arr => {
            for (let index = 0; index < this.sys_period; index++) {
                let indx = arr.employees.length / this.sys_period;
                let solds = [];
                arr.employees.slice(index * indx, indx * (index + 1)).map(ele => {
                    ele.vacationPeriod = index + 1;
                    console.log(ele.vacationPeriod)
                    solds.push(ele);
                });
                this.prdc_vct.push({
                    period: ` دورية ${index + 1} `,
                    sec_name: arr.section.name,
                    soliders: solds
                });
            }
        });
        this.rplcSoliders = this.soliders_arr;
    }
    pr_target() {
        this.prdc_vct
            .map((e) => {
                let arr = e.soliders;
                let trgs = arr.filter(srs => srs.militaryId === this.curr_sdu.curr_sol.militaryId)[0];
                let replace = arr.filter(srs => srs.militaryId === this.curr_sol_rplc.militaryId)[0];


                let index_target = arr.indexOf(trgs);
                let index_replace = arr.indexOf(replace);

                let rplc = { ...this.curr_sol_rplc };
                let trg = { ...this.curr_sdu.curr_sol };


                rplc.vacationPeriod = this.curr_sdu.curr_sol.vacationPeriod;
                trg.vacationPeriod = this.curr_sol_rplc.vacationPeriod;

                if (index_target >= 0) {
                    arr.splice(index_target, 1, rplc);
                }

                if (index_replace >= 0) {
                    arr.splice(index_replace, 1, trg);
                }
                e.soliders = arr;
                document.getElementById('canclePrModal').click();
            })
    }
    fDate(fdt) {
        this.fdists = this.dists.filter(e => this.datePipe.transform(e.created_at, 'yyyy-MM-dd') === fdt);
    }
    convertDate(date) {
        return this.datePipe.transform(date, 'yyyy-MM-dd')
    }
    showPeriodics() {
        this.prdc_vct
            .map((e) => {
                let arr = e.soliders;
                arr.map(ele => this.updateEmp(ele._id, { vacationPeriod: ele.vacationPeriod, updated_at: new Date(), available: true }));
            });

        alert('تم التوزيع');

    }
    prvApply(period) {

        this.soliders_arr
            .map(e => {
                (e.vacationPeriod == parseInt(period)) ? this.updateEmployeeAvailability(e, false) : this.updateEmployeeAvailability(e, true)
            });
        alert('تم التوزيع');


    }


    curr = [
        { _id: 2, name: 'manga', extra: { shiftAreas: [{ _id: 1, name: 'tower' }, { _id: 2, name: 'b-back' }] } },
        { _id: 1, name: 'a-bio', extra: { shiftAreas: [{ _id: 1, name: 'tower' }] } },
        { _id: 3, name: 'kasper', extra: { shiftAreas: [{ _id: 1, name: 'tower' }, { _id: 2, name: 'b-back' }, { _id: 3, name: 'gate' }] } },
        { _id: 4, name: 'Mubo', extra: { shiftAreas: [{ _id: 1, name: 'tower' }, { _id: 2, name: 'b-back' }, { _id: 3, name: 'gate' }, { _id: 4, name: 'tower' }] } }
    ]
    // Option funcs 
    resetDist() {
        // let arr = this.curr;
        // arr.sort(e => e.extra.shiftAreas.length).splice(0, 2);

        // arr.splice(arr.indexOf(arr.filter(e => e._id == 2)[0]), 1, { _id: 3, name: 'replaced' });
        // console.log(this.curr = arr);

        this.dists.map((ds) => {
            this.crudService.delete({
                url: `api/distribute/${ds._id}`
            }).subscribe((res: any) => {
                this.displayError(res);
            })
        });

    }
    resetVacationPeriod() {
        this.soliders_arr.map((ds) => {
            this.crudService.put({
                url: `api/employee/${ds._id}`,
                body: { vacationPeriod: 0, "extra.shiftAreas": [], onDuty: false }
            }).subscribe((res: any) => {
                this.displayError(res);
            })
        });
    }
    displayError(res) {
        if (res.err) alert('Something went wrong, try again later');
        else console.log(res.message);
    }
}