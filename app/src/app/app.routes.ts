import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SectionComponent } from './section/app.section';
import { SoliderTypeComponent } from './solider.types/app.solider.types';
import { VacationComponent } from './vacation/app.vacation';
import { VacationTypeComponent } from './vacationType/app.vacationType';
import { ExchangeComponent } from './exchange/app.exchange';
import { employeeComponent } from './employee/app.employee';
import { ServiceAreaComponent } from './service.area/app.service.area';
import { LoginComponent } from './login/app.login';
import { ProfileComponent } from './profile/profile.component'
import { SearchComponent } from './search/app.search.component'
import { SalaryComponent } from './salary/app.salary'
import { CategoryComponent } from './category/app.category'
import { SubCategoryComponent } from './subCategory/app.subCategory'
import { ItemComponent } from './item/app.item'
import { AttendanceComponent } from './attendance/app.attendance'
import { DistributeComponent } from './distribute/app.distribute.component'


const routes: Routes = [
    { path: '', redirectTo: '/section', pathMatch: 'full' },
    { path: 'section', component: SectionComponent },
    { path: 'vacation', component: VacationComponent },
    { path: 'vacationType', component: VacationTypeComponent },
    { path: 'solider', component: employeeComponent },
    { path: 'solider/:id', component: ProfileComponent },
    { path: 'soliderTypes', component: SoliderTypeComponent },
    { path: 'rank', component: ServiceAreaComponent },
    { path: 'search', component: SearchComponent },
    { path: 'salary', component: SalaryComponent },
    { path: 'attendance', component: AttendanceComponent },
    { path: 'distribute', component: DistributeComponent },
    { path: 'exchange', component: ExchangeComponent },
    { path: 'category', component: CategoryComponent },
    { path: 'item', component: ItemComponent },
    { path: 'subCategory', component: SubCategoryComponent },
    //serviceArea
    { path: 'login', component: LoginComponent },
    // implement notfound page later
    { path: '**', redirectTo: '/section', pathMatch: 'full' }
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
