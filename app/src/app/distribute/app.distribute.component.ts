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
    vacationTypes = []
    _prds = []
    srchSoliders = []
    rplcSoliders = []
    extSrvs = []

    sys_period = 0;
    period = 0;
    prv_period = 0;

    curr_sol_rplc: any;
    p: Number = 1
    save: Boolean = false;
    sol_splice_no: number = 4;

    constructor(private crudService: CRUDService, private datePipe: DatePipe) {
    }
    fdate = this.datePipe.transform(new Date(), 'yyyy-MM-dd')

    ngOnInit() {
        this.getserviceAreas();
        this.getEmployees();
        this.getSections();
        this.getVacations();
        this.getVacationTypes();
    }
    getVacations() {
        this.crudService.get({
            url: 'api/vacation'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.vacations = res.data;
        });
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
    getserviceAreas() {
        this.crudService.get({
            url: 'api/serviceArea'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.availableServingAreas = res.data;
        });
    }

    getEmployees() {
        this.crudService.get({
            url: 'api/employee'
        }).subscribe((res: any) => {
            this.displayError(res);
            this.soliders_arr = res.data;

            let availableSoliders = res.data.filter(e => e.available && e.dutiable);
            this.sol_splice_no = availableSoliders.filter(ele => ele.onDuty).length - availableSoliders.filter(ele => !ele.onDuty).length;



        });
    }

    rsv_soliders() {

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
    extRst = []
    distribute() {

        let _arr = this.soliders_arr.filter(e => e.available === true && e.dutiable);
        let ext = _arr.filter(e => e.extraServices > 0);

        this.soliderOnDuty = _arr.filter(ele => ele.onDuty);
        this.soliderOnRest = _arr.filter(ele => !ele.onDuty);

        // this.randomizeSource();

        this.extSrvs = ext;
        this.extRst = _arr.filter(e => e.vacation.name.includes("راحة"));
        this.srchSoliders = (ext.length > 0) ? ext : _arr.filter(e => e.onDuty === false);

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
        this.extSrvs = this.extSrvs.filter(ele => ele._id != solider._id);
        // this.extRst = this.extRst.filter(ele => ele._id != solider._id);
        return solider;
    }

    getSolider() {

        // Get random solider from random array of soliders [Rest  vacation type , soliders on rest , extra services] 
        // let fdt = (this.soliderOnRest.length > 0) ? this.soliderOnRest.sort(e => e.extra.shiftAreas.length) : this.soliderOnDuty.sort(e => e.extra.shiftAreas.length)
        // let fdd = this.extRst;
        // let container = [fdt, fdd, this.extSrvs];

        let arr = (this.extSrvs.length > 0) ? this.extSrvs : (this.soliderOnRest.length > 0) ? this.soliderOnRest.sort(e => e.extra.shiftAreas.length) : this.soliderOnDuty.sort(e => e.extra.shiftAreas.length).reverse();//this.randomizeSource();
        const indx = Math.floor(Math.random() * arr.length);
        return arr[indx];
    }

    randomizeSource() {
        let arr = this.soliderOnRest;
        if (this.extRst.length > 0) arr = arr.concat(this.extRst);
        if (this.extSrvs.length > 0) arr = arr.concat(this.extSrvs);

        // Get all available solider who has regular vacation and they are in rest status and do the same for Rest vacation 
        // Get the onDuty 
        // Set var for each of 'em 
        // Randomize 
        
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
        let arr_filter = this.soliders_arr.filter(e => e.available && e.dutiable && !e.onDuty);
        this.srchSoliders = arr_filter.filter(sol => sol.name.includes(srch) || sol.militaryId.includes(srch));
    }
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
        this.rplcSoliders = this.soliders_arr.filter(e => e.available === true && e.section.name === this.curr_sdu.curr_sol.section.name);
    }

    curr_sol_destination(sol) {
        this.curr_sol_rplc = sol;
    }
    replace_destination() {
        this.ctrSrvs
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
    exchangeDist: any = {};
    ex_target: any = {};
    ex_sol: any = {};
    exchangeable = [];

    exchange() {
        this.exchangeDist.soliders.map(e => {
            let arr = e.srcSolds;
            let index_target = arr.indexOf(this.ex_target);
            if (index_target >= 0) {
                arr.splice(index_target, 1, this.ex_sol);
                this.crudService.post({
                    url: `api/exchange`,
                    body: { target: this.ex_target._id, replaced: this.ex_sol._id, created_at: new Date(), dist: this.exchangeDist._id }
                }).subscribe((res: any) => {
                    this.displayError(res);
                    document.getElementById('cancleEXModal').click();
                    alert('تمت الميادلة بنجاح');
                });
            }
        })

    }

    getLastService() {
        this.crudService.get({
            url: `api/distribute/last`
        }).subscribe((res: any) => {
            this.displayError(res);
            this.exchangeDist = res.data;
            this.exchangeable = (this.soliderOnRest.length > 0) ?
                this.soliderOnRest.sort(e => e.extra.shiftAreas.length).slice(0, 5) :
                this.soliders_arr.filter(e => e.available && e.dutiable && !e.onDuty).sort(e => e.extra.shiftAreas.length).slice(0, 5);
        });
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
        this.soliderOnDuty.map(sol => this.updateEmp(sol._id, { onDuty: false, updated_at: new Date(), extraServices: sol.extraServices }));
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

        let _sol = this.soliders_arr.filter(e => e.available === true && e._id === _id)[0];
        if (_sol && body.onDuty != undefined) {
            _sol.onDuty = body.onDuty;
        }
        if (_sol && _sol.extraServices > 0) {
            _sol.extraServices -= 1;
            body.extraServices = _sol.extraServices;
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
        this.prdc_vct = []
        let _arr = this.cmbEmployees();
        _arr.map(arr => {
            let count = arr.section.vacationType.durationCount;
            for (let index = 0; index < count; index++) {
                let indx = arr.employees.length / count;
                let solds = [];
                arr.employees.slice(index * indx, indx * (index + 1)).map(ele => {
                    ele.vacationPeriod = index + 1;
                    solds.push(ele);
                });
                this.prdc_vct.push({
                    period: ` دورية ${index + 1} `,
                    sec_name: arr.section.name,
                    periodCount: count,
                    soliders: solds
                });
            }
        });
        this.rplcSoliders = this.soliders_arr;
    }
    changePeriod() {
        this.prdc_vct = [];
    }
    pr_target() {
        this.prdc_vct
            .map((e) => {
                let arr = e.soliders;
                let trgs = arr.filter(srs => srs.militaryId === this.curr_sdu.curr_sol.militaryId);
                let replace = arr.filter(srs => srs.militaryId === this.curr_sol_rplc.militaryId);

                if (replace.length > 0) {
                    let index_replace = arr.indexOf(replace[0]);
                    let trg = { ...this.curr_sdu.curr_sol };
                    trg.vacationPeriod = this.curr_sol_rplc.vacationPeriod;
                    replace.map(e => e.vacationPeriod = this.curr_sdu.curr_sol.vacationPeriod);
                    arr.splice(index_replace, 1, trg);
                }

                if (trgs.length > 0) {
                    let index_target = arr.indexOf(trgs[0]);
                    let rplc = { ...this.curr_sol_rplc };
                    rplc.vacationPeriod = this.curr_sdu.curr_sol.vacationPeriod;
                    trgs.map(e => e.vacationPeriod = this.curr_sol_rplc.vacationPeriod);
                    arr.splice(index_target, 1, rplc);
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
                arr.map(ele => {
                    this.updateEmp(ele._id, { vacationPeriod: ele.vacationPeriod, vacationType: ele.vacation._id, updated_at: new Date(), available: true })
                });
            });
        alert('تم التوزيع');
    }
    prdSolider = [];
    fprdsol(prv_period, vct) {
        if (this.prdc_vct.length > 0) {
            let _sl = []
            this.prdc_vct
                .map((e) => {
                    let arr = e.soliders;
                    arr.filter(e => e.vacationPeriod === parseInt(prv_period) && e.vacation._id === vct).map(e => _sl.push(e))
                });
            this.prdSolider = _sl;
        } else {
            this.prdSolider = this.soliders_arr.filter(e => e.vacationPeriod === parseInt(prv_period) && e.vacation._id === vct)
        }

    }

    vct_period = ""
    prvApply(period, vct) {
        this.soliders_arr
            .filter(e => e.vacation._id == vct)
            .map(e => {
                (e.vacationPeriod == parseInt(period)) ? this.updateEmployeeAvailability(e, false) : this.updateEmployeeAvailability(e, true)
            });
        alert('تم التوزيع');

    }
    resetDist() {
      
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
                body: { vacationPeriod: 0, "extra.shiftAreas": [], onDuty: false, available: true }
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