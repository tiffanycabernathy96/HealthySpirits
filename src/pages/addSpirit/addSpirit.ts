import { Component } from '@angular/core';
import {NavParams, NavController, ModalController, ViewController, PopoverController} from 'ionic-angular';
import { Data } from '../../providers/data';
import {EditRecipePage} from "../editRecipe/editRecipe";
import {AddAmountComponent} from "../../components/add-amount/add-amount";

@Component({
  selector: 'page-addSpirit',
  templateUrl: 'addSpirit.html'
})
export class AddSpiritPage
{
  spirits;
  amount;
  item;
  searchList: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataService: Data,
              public popoverCtrl: PopoverController,
              public view: ViewController) {

    this.spirits = this.navParams.get('ingredient');

    this.UserDatabaseItems()
  }


  getItems(ev){

    this.UserDatabaseItems();

    const val = ev.target.value;


    if (val && val.trim() != '') {
      this.searchList = this.searchList.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })

    }

  }

  UserDatabaseItems() {

    this.searchList = this.spirits;

  }


  presentPopover(mixer: string, myEvent) {
    let popover = this.popoverCtrl.create(AddAmountComponent);
    popover.present();

    popover.onDidDismiss(PopoverData => {
      this.amount = PopoverData;
      this.closeWithAdd(mixer)
    });
  }

  closeWithAdd(mixer: string)
  {
    this.item = [mixer,this.amount]
    this.view.dismiss(this.item);
  }

  close(){
    this.navCtrl.pop()
  }
}
