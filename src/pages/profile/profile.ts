import { Component } from '@angular/core';
import { ModalController, NavController, Events } from 'ionic-angular';
import { Data } from '../../providers/data';
import { Parse } from 'parse';
import { SigninPage } from '../signin/signin';
import { EditProfilePage } from '../editProfile/editProfile';
import { AlertController } from 'ionic-angular';
import {Facebook, FacebookLoginResponse} from "@ionic-native/facebook";
import {TabsPage} from "../tabs/tabs";

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',

})
export class ProfilePage {

  public user;
  username: string;
  email: string;
  fbLoginStatus: boolean;

	constructor(public navController: NavController,
              public modalCtrl: ModalController,
              public dataService: Data,
              public alertController: AlertController,
              public fb: Facebook,
			  public events: Events) {

    this.user = this.dataService.getCurrentUser();
    this.username = this.user.attributes.username;
    this.email = this.user.attributes.email;

    fb.getLoginStatus().then((res: FacebookLoginResponse) => {
      if(res.status == "connected") {
        this.fbLoginStatus = true;
      } else {
        this.fbLoginStatus = false;
      }
    }).catch(e => console.log(e));
	}

	edit(){
		const editModal = this.modalCtrl.create(EditProfilePage);
		editModal.onDidDismiss( (item)=> {
		if(item)
		{
			this.username = item.username;
			this.email = item.email;
		}
		});
		editModal.present();
	}

	logout() {
		var self = this;
		self.dataService.logout();
		Parse.User.logOut().then(() => {
			var currentUser = Parse.User.current(); // this will now be null
			this.events.publish('user:logout');
		});
	}

  async connectToFacebook() {

	  let alert = this.alertController.create({
      title: 'Connect to Facebook?',
      message: 'This will log you out of your current Healthy Spirits account and create a new account. You will lose any recipes you have created.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancelled');
          }
        },
        {
          text: 'Log in with Facebook',
          handler: () => {
            this.logout();
            this.loginWithFacebook();
            console.log('Log in with Facebook');
          }
        }
      ]
    });

    alert.present();
  }

  async loginWithFacebook() {
    try {
      // Log in to Facebook and request user data
      let facebookResponse = await this.fb.login(['public_profile', 'email']);
      let facebookAuthData = {
        id: facebookResponse.authResponse.userID,
        access_token: facebookResponse.authResponse.accessToken,
      };

      // Request the user from parse
      let toLinkUser = new Parse.User();
      let user = await toLinkUser._linkWith('facebook', {authData: facebookAuthData});

      // If user did not exist, updates its data
      if (!user.existed()) {
        let userData = await this.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture)', []);
        user.set('username', userData.name);
        user.set('name', userData.name);
        user.set('email', userData.email);
        await user.save();
      }

      this.navController.setRoot(TabsPage);
      this.dataService.setCurrentUser(user);
    } catch (err) {
      console.log('Error logging in', err);

      this.alertController.create({
        message: err.message
      }).present();
    }
  }

}
