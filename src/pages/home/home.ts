import { Component } from '@angular/core';
import { ModalController, NavController, App } from 'ionic-angular';
import { Data } from '../../providers/data';
import { DrinkDetailPage } from '../drinkDetail/drinkDetail';
import {SigninPage} from "../signin/signin";
import  {StartPage} from "../start/start";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  
})
export class HomePage {

	public topDrink;
	public creator;
    public NotGuestMode;
	constructor(public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Data, public appCtrl: App) {
		this.topDrink = this.dataService.getTopDrink();
		if(this.topDrink.creator == "HS")
			this.creator = "Healthy Spirits"
		else
			this.creator = this.topDrink.creator;
	}
    ionViewWillEnter()
    {
        this.NotGuestMode = this.dataService.getNotGuestMode();
    }
    
	displayDrinkDetail() {
		this.navCtrl.push(DrinkDetailPage,
		{item: this.topDrink}); 
	}
    signIn()
    {
        this.appCtrl.getRootNav().setRoot(StartPage);
    }
}
