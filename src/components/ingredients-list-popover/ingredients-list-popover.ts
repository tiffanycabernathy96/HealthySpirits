import { Component } from '@angular/core';
import {NavParams} from "ionic-angular";

/**
 * Generated class for the IngredientsListPopoverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'ingredients-list-popover',
  templateUrl: 'ingredients-list-popover.html'
})
export class IngredientsListPopoverComponent {

  text: string;
  Ingredients: any;

  constructor(public navParams:NavParams) {
    console.log('Hello IngredientsListPopoverComponent Component');
    this.text = 'Hello World';

    this.Ingredients = this.navParams.get('Ingredients')


  }

}
