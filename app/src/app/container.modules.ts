// Services
import { AuthenticationService } from './services/app.authentication';
import { CRUDService } from './services/app.crud';
import { Encryption } from './services/encryption';

// Components
import { AppComponent } from './app.component';
import { SectionComponent } from './section/app.section';
import { SalaryComponent } from './salary/app.salary'

import { SoliderTypeComponent } from './solider.types/app.solider.types';
import { employeeComponent } from './employee/app.employee';
import { ProfileComponent } from './profile/profile.component'
import { SearchComponent } from './search/app.search.component'
import { DistributeComponent } from './distribute/app.distribute.component'
import { AttendanceComponent } from './attendance/app.attendance'

import { VacationComponent } from './vacation/app.vacation';
import { VacationTypeComponent } from './vacationType/app.vacationType';
import { ExchangeComponent } from './exchange/app.exchange';
import { CategoryComponent } from './category/app.category'
import {  SubCategoryComponent } from './subCategory/app.subCategory'
import { ItemComponent } from './item/app.item'

import { LoginComponent } from './login/app.login';
import { ValidateComponent } from './directives/app-form';
import { ServiceAreaComponent } from './service.area/app.service.area';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptor } from './services/interceptor';
import { DatePipe } from '@angular/common';

export class Container {
    declarations = [
        AppComponent,
        SectionComponent,
        SalaryComponent,
        LoginComponent,
        SoliderTypeComponent,
        ValidateComponent,
        employeeComponent,
        AttendanceComponent,
        ServiceAreaComponent,
        VacationComponent,
        VacationTypeComponent,
        ExchangeComponent,
        ProfileComponent,
        SearchComponent,
        DistributeComponent,
        CategoryComponent,
        SubCategoryComponent,
        ItemComponent
    ];
    providers = [{
        provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true,
    }, AuthenticationService, CRUDService, Encryption, DatePipe];
}
