import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class HelperService {
    ApiUrl = 'http://localhost:3000';
    // 'http://iisnode.local.com';
    constructor(
        private http: HttpClient
    ) { }

    signUp(user) {
        return new Observable(observer => {
            this.http.post(`${this.ApiUrl}/signUp`, JSON.stringify(user), this.getHeader())
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

    private getHeader() {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'access-control-allow-headers,access-control-allow-origin,content-type,authorization'
        });
        return { headers: headers };
    }
}

