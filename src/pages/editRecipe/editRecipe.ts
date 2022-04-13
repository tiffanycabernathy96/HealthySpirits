import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, AlertController} from 'ionic-angular';
import { Data } from '../../providers/data';
import { AddSpiritPage } from "../addSpirit/addSpirit";
import { StartPage } from "../start/start";
import { AddNewIngredientPage } from '../addNewIngredient/addNewIngredient';
import { EditUserIngredientPage } from '../editUserIngredient/editUserIngredient';
import { AddAmountComponent } from "../../components/add-amount/add-amount";
import { ColorGuidePopoverComponent } from "../../components/color-guide-popover/color-guide-popover";
import { FilterComponent } from "../../components/filter/filter";
import { DrinkDetailPage } from '../drinkDetail/drinkDetail';
import { IngredientsListPopoverComponent } from "../../components/ingredients-list-popover/ingredients-list-popover";
import { NgZone } from "@angular/core";
import event = google.maps.event;

@Component({
  selector: 'page-editRecipe',
  templateUrl: 'editRecipe.html',

})
export class EditRecipePage {
	showSpirits: boolean = true;
	showMixers: boolean = true;
	showUsersIng: boolean = true;

	EditMode: boolean = false;
	drinkId;

	allIngredients;

	currentIngredients = [];
	currentAmounts = [];
	currentBoth = [];

	editableIngredients = [];
	editableAmounts = [];
	editableBoth = [];

	drinkName = "Drink Name";

	drinkForEdit: any;

	absinthes=[];
	baijius=[];
	brandys=[];
	cachacas=[];
	gins=[];
	liqueurs=[];
	mezcals=[];
	mixers=[];
	rums=[];
	scotches=[];
	sojus=[];
	tequilas=[];
	vermouths=[];
	vodkas=[];
	whiskeys=[];

	searchMixers=[];

	userCreatedIngredients = [];

	constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataService: Data,
			  private alertCtrl: AlertController,
              public popoverCtrl: PopoverController,
              public modalCtrl: ModalController) {
	
	}


	addIngredient (mixer, amount:number)
	{
		if(!isNaN(amount) && amount >0)
		{
			this.currentIngredients.push(mixer);
			this.currentAmounts.push(amount);
			this.currentBoth.push({Item: mixer, Name: mixer.name, Amount: amount});
			console.log(mixer);
		}
	}

	ionViewWillEnter()
	{
		this.resetLists();
		this.populateIngredients();
		let drink = this.dataService.getEditDrink();
		var emptyDrink;
		if(drink)
		{
			this.populateEditMode(drink);
			this.dataService.setEditDrink(emptyDrink);
		}
		else
		{
			this.EditMode = false;
			this.currentIngredients = [];
			this.currentAmounts = [];
			this.currentBoth = [];

			this.drinkName = "NewDrink";
		}
	}

	openAddSpirit(ingredient)
	{
		let AddSpiritModal = this.modalCtrl.create(AddSpiritPage, {ingredient: ingredient});
		AddSpiritModal.present()

		AddSpiritModal.onDidDismiss(InputData => {
			if (InputData == undefined){

			}else{
				this.addIngredient(InputData[0], InputData[1])
			}
		});
	}


	populateIngredients()
	{
		this.userCreatedIngredients = this.dataService.getUserCreatedIngredients();


		this.allIngredients = this.dataService.getPossibleIngredients();
		this.allIngredients = this.allIngredients.sort((a, b) => a.name > b.name ? 1 : -1);

		for(var i = 0; i < this.allIngredients.length; i++)
		{
			if(this.allIngredients[i].type == "Absinthe") {
				this.absinthes.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Baijiu") {
				this.baijius.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Brandy") {
				this.brandys.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Cachaca") {
				this.cachacas.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Gin") {
				this.gins.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Liqueur") {
				this.liqueurs.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Mezcal") {
				this.mezcals.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Mixer") {
				this.mixers.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Rum") {
				this.rums.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Scotch") {
				this.scotches.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Soju") {
				this.sojus.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Tequila") {
				this.tequilas.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Vermouth") {
				this.vermouths.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Vodka") {
				this.vodkas.push(this.allIngredients[i]);
			}
			else if(this.allIngredients[i].type == "Whiskey") {
				this.whiskeys.push(this.allIngredients[i]);
			}
		}
		this.initializeItems();
	}

public populateEditMode(item: any) {


    this.EditMode = true;
    this.drinkForEdit = item;
	this.drinkId = item.id;
    this.drinkName = this.drinkForEdit.name;
    let incomingAmounts = this.drinkForEdit.recipeIngredientAmts;
    let incomingIngredients = this.drinkForEdit.recipeIngredients;



    this.parseCurrentIngredients(this.dataService.matchIDwithIngredient(incomingIngredients, incomingAmounts));
    this.currentIngredients = this.editableIngredients;
    this.currentAmounts = this.editableAmounts;
    this.currentBoth = this.editableBoth;


  }


	parseCurrentIngredients(arrayToParse){

	  for (var i = 0; i < arrayToParse.length; i++){
	    this.editableIngredients.push(arrayToParse[i].item);
	    this.editableAmounts.push(arrayToParse[i].amount);
	    this.editableBoth.push({Item: arrayToParse[i].item, Name: arrayToParse[i].item.name, Amount: arrayToParse[i].amount});
    }
  }

	presentColorHelper(myEvent){
	  let popover = this.popoverCtrl.create(ColorGuidePopoverComponent, {}, {cssClass: 'popover-top-right-guide'});
	  popover.present({
      ev: myEvent
    });
  }


presentPopover(mixer: string, ev: event )
	{
		let popover = this.popoverCtrl.create(AddAmountComponent);
		popover.present();

		popover.onDidDismiss(PopoverData => {
			if(PopoverData)
			{
				this.addIngredient(mixer, PopoverData)
			}
		});
	}


	presentIngredientsList(myEvent)
	{
		let popover = this.popoverCtrl.create(IngredientsListPopoverComponent, {Ingredients: this.currentIngredients});
		popover.present({
			ev: myEvent
		});
	}


	resetLists()
	{
		this.absinthes=[];
		this.baijius=[];
		this.brandys=[];
		this.cachacas=[];
		this.gins=[];
		this.liqueurs=[];
		this.mezcals=[];
		this.mixers=[];
		this.rums=[];
		this.scotches=[];
		this.sojus=[];
		this.tequilas=[];
		this.vermouths=[];
		this.vodkas=[];
		this.whiskeys=[];
	}

  removeIngredient(item: any){
	  //get ID, check ID, remove equivalent ID
    console.log("Current: ", item)

	this.currentIngredients.splice(this.currentIngredients.indexOf(item.Item), 1);
    this.currentBoth.splice(this.currentBoth.indexOf(item),1);
    this.currentAmounts.splice(this.currentAmounts.indexOf(item.Amount), 1);
  }

  saveDrink() {
	  if(this.EditMode == true)
	  {
		  this.EditMode = false;
		  this.updateDrink();
		  return;
	  }
    let drink = {
      name: this.drinkName,
      likes: 0,
      dislikes: 0,
      Ingredients: this.currentIngredients,
      IngredientAmounts: this.currentAmounts
    };
    if (this.currentIngredients.length > 0) {
      let drink = {
        name: this.drinkName,
        likes: 0,
        dislikes: 0,
        Ingredients: this.currentIngredients,
        IngredientAmounts: this.currentAmounts
      }
      if (this.currentIngredients.length > 0) {
        this.dataService.addUserDrink(drink);

        this.currentIngredients = [];
        this.currentAmounts = [];
        this.currentBoth = [];

        this.drinkName = "NewDrink";
        let alert = this.alertCtrl.create({
          title: 'Recipe Saved!',
          buttons: [{
            text: 'Ok'
          }]
        });
        alert.present();
        this.navCtrl.parent.select(1);
      } else {
        let alert = this.alertCtrl.create({
          title: 'No Ingredients Added',
          buttons: [{
            text: 'Ok'
          }]
        });
        alert.present();
      }
    }
  }

	viewCurrentIngredients()
	{
		for (var i = 0; i < this.currentIngredients.length; ++i) {
			console.log(this.currentIngredients[i].name + " " + this.currentAmounts[i]);
		}
	}


	toggleSpirits()
	{
		var x = document.getElementById("spirits");
		if (x.style.display === "none") {
			x.style.display = "block";
			this.showSpirits = true;
		} else {
			x.style.display = "none";
			this.showSpirits = false;
		}
	}




	updateDrink() {

		let drink = {
			id: this.drinkId,
			name: this.drinkName,
			likes: this.drinkForEdit.likes,
			dislikes: this.drinkForEdit.dislikes,
			Ingredients: this.currentIngredients,
			IngredientAmounts: this.currentAmounts
		};

		if(this.currentIngredients.length > 0) {
			// Data File Call @Tiffany
			this.dataService.updateUserDrink(drink);
			this.currentIngredients = [];
			this.currentAmounts = [];
			this.currentBoth = [];
			this.drinkName = "NewDrink";

			let alert = this.alertCtrl.create({
			title: 'Recipe Edited!',
			buttons: [{
			text: 'Alright'
			}]
			});

			alert.present();
			this.navCtrl.parent.select(1);
		} else {
			let alert = this.alertCtrl.create({
				title: 'No Ingredients In Drink',
				buttons: [{
					text: 'Ok'
				}]
			});
			alert.present();
		}
	}

addNewIngredient() {
  this.navCtrl.push(AddNewIngredientPage);
}


  toggleMixers()
	{
		var x = document.getElementById("mixers");
		if (x.style.display === "none") {
			x.style.display = "block";
			this.showMixers = true;
		} else {
			x.style.display = "none";
			this.showMixers = false;
		}
	}
	toggleUI()
	{
		var x = document.getElementById("userIngredients");
		if (x.style.display === "none") {
			x.style.display = "block";
			this.showUsersIng = true;
		} else {
			x.style.display = "none";
			this.showUsersIng = false;
		}
	}
	initializeItems()
	{
		this.searchMixers=this.mixers;
	}
	getItems(ev: any)
	{
		// Reset items back to all of the items
		this.initializeItems();

		// set val to the value of the searchbar
		let val = ev.target.value;

		// if the value is an empty string don't filter the items
		if (val && val.trim() != '') {
			this.searchMixers = this.searchMixers.filter((item) => {
				return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
			})
		}
	}

	editIngredient(item)
	{
		this.navCtrl.push(EditUserIngredientPage,{item:item});
	}
	deleteIngredient(item)
	{
		this.dataService.deleteUserIngredient(item);
		this.userCreatedIngredients.splice(this.userCreatedIngredients.indexOf(item),1);
		let alert = this.alertCtrl.create({
		title: 'Ingredient Deleted!',
			buttons: [{
				text: 'Ok'
			}]
		});
		alert.present();
	}
}
