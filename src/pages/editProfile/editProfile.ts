import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import { Data } from '../../providers/data';
import { ProfilePage } from '../profile/profile';
import { AlertController } from 'ionic-angular';
import { Parse, ParseUser, LogInCallback, ParseException } from 'parse';

@Component({
  selector: 'page-editProfile',
  templateUrl: 'editProfile.html'
})
export class EditProfilePage {

  public user;
  username: string;
  password: string;
  email: string;

  constructor(public navCtrl: NavController, public view: ViewController, public dataService: Data,
        private alertCtrl: AlertController) {

    this.user = this.dataService.getCurrentUser();
    this.username = this.user.attributes.username;
    this.password = this.user.attributes.password;
    this.email = this.user.attributes.email;

  }

  goBack() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'Are you sure you want to leave this page? All unsaved changes will be lost.',
      buttons: [
      {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Go Back',
          handler: () => {
            console.log('Go Back clicked');
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }

  saveChanges() {

    this.presentChangesSaved();
  }

  changePassword() {
    this.presentChangePassword();
  }

  presentChangesSaved() {
	this.save();
	let alert = this.alertCtrl.create({
		title: 'Changes Saved',
		subTitle: 'Your changes have been saved.',
		buttons: ['Dismiss']
	});
	alert.present();
  }

  presentChangePassword() {
    let alert = this.alertCtrl.create({
      title: 'Change Password',
      inputs: [
        {
          name: 'currentPassword',
          placeholder: 'Current Password',
          type: 'password'
        },
        {
          name: 'newPassword',
          placeholder: 'New Password',
          type: 'password'
        },
        {
          name: 'verifyNewPassword',
          placeholder: 'Verify New Password',
          type: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save Changes',
          handler: data => {
            if(!this.checkCurrentPassword(data.currentPassword)) {
              console.log('handler fail');
              this.presentIncorrectPassword();
            }
            else if (data.newPassword != data.verifyNewPassword) {
              this.presentPasswordsDoNotMatch();
            }
            else{
              this.password = data.newPassword;
              this.save();
            }
          }
        }
      ]
    });
    alert.present();
  }

  async checkCurrentPassword(currentPassword) {
    try {
      await Parse.User.logIn(this.username, currentPassword,
        {
          success: function (user) {
            console.log('check current password success');
            return true;
          }
        })
    }
    catch (e) {
      console.log('check current password fail');
      console.log(e);
      this.presentIncorrectPassword();
      return false;
    }
  }

  presentPasswordsDoNotMatch() {
    let alert = this.alertCtrl.create({
      title: 'Passwords Do Not Match',
      subTitle: 'Please try again.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  presentIncorrectPassword() {
    let alert = this.alertCtrl.create({
      title: 'Incorrect Password',
      subTitle: 'Password change was denied because the current password was incorrect. Please try again.',
      buttons: ['Dismiss']
    });
    alert.present();
  }

  save() {
		let newProfile = {
		id: this.user.id,
		email: this.email,
		username: this.username,
		password: this.password,
    };
		this.dataService.updateCurrentUser(newProfile);
		this.view.dismiss(newProfile);
  }

}
