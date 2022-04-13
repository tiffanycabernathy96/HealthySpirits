import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';
import { Facebook } from '@ionic-native/facebook'
import { AlertController } from 'ionic-angular';
// Providers
import { Data } from '../../providers/data';

// Pages
import { SignupPage } from '../signup/signup';
import { TabsPage } from '../tabs/tabs';

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html'
})
export class SigninPage {
  registerPage = SignupPage;
  password: string = '';
  username: string = '';
  isLoggedIn: boolean = false;
  users: any;
  public NotGuestMode;
  constructor(public navCtrl: NavController,
              public data: Data,
              private alertCtrl: AlertController,
              private loadCtrl: LoadingController,
              private fb: Facebook) {

    this.fb.logout();

  }

  async login() {
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
      this.data.setNotGuestMode(true);
      this.data.setCurrentUser(user);
    } catch (err) {
      console.log('Error logging in', err);

      this.alertCtrl.create({
        message: err.message
      }).present();
    }
  }

  ionViewDidLoad() {
    console.log('Initiated Signin');
  }

  public doSignin() {
	  Parse.User.logOut();
    let loader = this.loadCtrl.create({
      content: 'Signing in...'
    });
    loader.present();
    var self = this;
    Parse.User.logIn(this.username, this.password,
      {
        success: function(user)
        {
          self.data.setNotGuestMode(true);
		  self.navCtrl.push(TabsPage);
          self.data.setCurrentUser(user);
          loader.dismissAll();
        },
        error: function(user, error)
        {
          self.presentAlert(error);
          loader.dismissAll();


        }
      });
  }
  async presentAlert(error) {
    const alert = await this.alertCtrl.create({
      title: 'Error: Code ' + error.code,
      message: error.message,
      buttons: ['OK']
    });

    await alert.present();
  }
 
}
