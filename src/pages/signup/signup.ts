import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { Parse } from 'parse';
// Pages
import { TabsPage } from '../tabs/tabs';
import { SigninPage} from "../signin/signin";
import { Data } from '../../providers/data';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
	signinPage = SigninPage;
	password: string = '';
	username: string = '';
	verify: string = '';
	email: string = '';
	constructor(public navCtrl: NavController,public data: Data, private loadCtrl: LoadingController) 
	{ 
	
	}

	ionViewDidLoad() 
	{
		console.log('Initiate Signup');
	}

	public doRegister() 
	{
		var user = new Parse.User();
		if(this.password == this.verify)
		{
			let loader = this.loadCtrl.create({
				content: 'Signing up...'
			});
			loader.present();
			user.set("username", this.username);
			user.set("password", this.password);
			user.set("email", this.email);
			var self = this;
			user.signUp(null, 
			{
				success: function(user) {
					loader.dismissAll();
					self.navCtrl.setRoot(TabsPage);
					self.data.setCurrentUser(user);
				},
				error: function(user, error) {
					// Show the error message somewhere and let the user try again.
					alert("Error: " + error.code + " " + error.message);
					loader.dismissAll();
				}
			});
		}
		else
		{
			alert("Error: Passwords Do Not Match");
		}
	}

	SignInBack()
	{
		this.navCtrl.pop();
		this.navCtrl.push(SigninPage);
	}

}
