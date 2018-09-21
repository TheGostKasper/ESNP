import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import { CompilerConfig } from '../../../node_modules/@angular/compiler';

@Injectable()
export class CRUDService {
    ApiUrl = 'http://localhost:8080';
    // 'http://iisnode.local.com';
    constructor(
        private http: HttpClient
    ) { }

    get(config) {
        return new Observable(observer => {
            this.http.get(`${this.ApiUrl}/${config.url}`, this.getHeader())
                .subscribe(
                    (response: Response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                    }
                );
        });
    }
    post(config) {
        return new Observable(observer => {
            this.http.post(`${this.ApiUrl}/${config.url}`, JSON.stringify(config.body), this.getHeader())
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
    put(config) {
        return new Observable(observer => {
            this.http.put(`${this.ApiUrl}/${config.url}`,JSON.stringify(config.body), this.getHeader())
                .subscribe(
                    (response: Response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                    }
                );
        });
    }
    delete(config) {
        return new Observable(observer => {
            this.http.delete(`${this.ApiUrl}/${config.url}`, this.getHeader())
                .subscribe(
                    (response: Response) => {
                        observer.next(response);
                        observer.complete();
                    },
                    error => {
                        observer.error(error);
                    }
                );
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
