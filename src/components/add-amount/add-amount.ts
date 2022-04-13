import { Component } from '@angular/core';
import { Data } from '../../providers/data';
import {NavController, NavParams, ViewController} from "ionic-angular";
import {EditRecipePage} from "../../pages/editRecipe/editRecipe";
import {Storage} from "@ionic/storage";

@Component({
  selector: 'add-amount',
  templateUrl: 'add-amount.html'
})
export class AddAmountComponent {

  text: string;
  amount: number;
  check: boolean;
  pushAmount: number;

  constructor(public viewCtrl: ViewController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private storage: Storage) {

    this.check = false;
  }

  close() {
    this.viewCtrl.dismiss();
  }

  addToList() {
    this.viewCtrl.dismiss(this.amount);
  }

}
