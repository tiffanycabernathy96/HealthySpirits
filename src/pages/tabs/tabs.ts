import { Component } from '@angular/core';
import { Events, NavController } from 'ionic-angular';
// Providers
import { Data } from '../../providers/data';

import { HomePage } from '../home/home';
import { RecipesPage } from '../recipes/recipes';
import { EditRecipePage } from '../editRecipe/editRecipe';
import { ProfilePage } from '../profile/profile';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
	tab1Root = HomePage;
	tab2Root = RecipesPage;
	tab3Root = EditRecipePage;
	tab4Root = ProfilePage;
	public NotGuestMode;

	constructor(public dataService: Data, public events: Events, public navCtrl: NavController) {
		events.subscribe('user:logout', () => {
			this.navCtrl.popToRoot();
		});
	}
	ionViewWillEnter()
	{
		this.NotGuestMode = this.dataService.getNotGuestMode();
	}
    
	
}
