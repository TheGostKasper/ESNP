import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService {
    ApiUrl = 'http://localhost:8080';
    // 'http://iisnode.local.com';
    constructor(
        private http: HttpClient
    ) { }
    logIn(user) {
        return new Observable(observer => {
            this.http.post(`${this.ApiUrl}/login`, JSON.stringify(user), this.getHeader())
                .subscribe(
                    (response: Response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                    });
        });

    }
    signUp(user) {
        return new Observable(observer => {
            this.http.post(`${this.ApiUrl}/api/employee`, JSON.stringify(user), this.getHeader())
                .subscribe(
                    (response: Response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                    });
        });
    }
    checkToken() {
        // if (!localStorage.getItem('token')) {
        //     window.location.href = '/login';
        // }
    }
    getToken() {
        return localStorage.getItem('token');
    }

    private getHeader() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin,content-type,authorization'
        });
        return { headers: headers };
    }
}
