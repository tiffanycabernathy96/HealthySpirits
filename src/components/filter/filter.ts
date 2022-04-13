import { Component } from '@angular/core';
import {ViewController} from "ionic-angular";


@Component({
  selector: 'filter',
  templateUrl: 'filter.html'
})
export class FilterComponent {

  text: string;
  types:any;

  constructor( public viewCtrl: ViewController) {
    this.types = [
      {name: "Whiskey"},
      {name: "Vodka"},
      {name: "Rum"},
      {name: "Brandy"},
      {name: "Beer"},
      {name: "Virgin"}
    ]

  }



}
