import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Parse } from 'parse';
// Providers
import { Data } from '../../providers/data';

//pages
import {SigninPage} from "../signin/signin";
import {SignupPage} from "../signup/signup";
import { TabsPage } from '../tabs/tabs';

@IonicPage()
@Component({
  selector: 'page-start',
  templateUrl: 'start.html',
})
export class StartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public dataService: Data) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StartPage');
  }
  
  GuestSignIn(){
      this.dataService.setNotGuestMode(false);
      this.navCtrl.setRoot(TabsPage);
  }

  SignUpDeeper(){
    this.dataService.setNotGuestMode(true);
    this.navCtrl.push(SignupPage);
  }

  SignInDeeper(){
    this.dataService.setNotGuestMode(true);
    this.navCtrl.push(SigninPage);
  }
}
