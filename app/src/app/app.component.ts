import { Component, OnInit } from '@angular/core';
import {  Location } from '@angular/common';


declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  token: boolean;

  constructor(public location: Location) {
    this.token = (localStorage.getItem('token')) ? true : false;
  }
  ngOnInit() {
  }
}
