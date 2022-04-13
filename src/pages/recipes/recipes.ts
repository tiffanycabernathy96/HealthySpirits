import { Component } from '@angular/core';
import { ModalController, NavController, PopoverController} from 'ionic-angular';
import { Data } from '../../providers/data';

import { DrinkDetailPage } from '../drinkDetail/drinkDetail';
import { EditRecipePage } from "../editRecipe/editRecipe";
import { FilterComponent} from "../../components/filter/filter";

@Component({
  selector: 'page-recipes',
  templateUrl: 'recipes.html',

})
export class RecipesPage {
  segment: string;
  public allRecipes = [];
  public userRecipes = [];
  public topRecipes = [];
  public SearchClicked = false;
  items: any;
  searchedRecipes: any;
  topDrinksSearch: any;
  public NotGuestMode;
  GuestModeSegmentValue: string;

  constructor(public navCtrl: NavController, public modalCtrl: ModalController, public dataService: Data, public popoverCtrl: PopoverController) {

    //Selects My Drinks on Start
    this.NotGuestMode = this.dataService.getNotGuestMode();
    this.UserDatabaseItems();
    if (this.NotGuestMode){
      this.segment = "0";
    }else{
      this.segment = "1";
    }

  }

  ionViewWillEnter() {
    this.allRecipes = this.dataService.getStaffDrinks();
    this.userRecipes = this.dataService.getUserDrinks();
    this.topRecipes = this.dataService.getTopDrinks();
    this.UserDatabaseItems()
    this.NotGuestMode = this.dataService.getNotGuestMode();


  }

  //Filter Popover
  FilterPopover(myEvent) {
    let popover = this.popoverCtrl.create(FilterComponent, {}, {cssClass: 'popover-top-right'});
    popover.present({
      ev: myEvent
    });

  }


  SearchToggle() {
    if (this.SearchClicked == true) {
      this.SearchClicked = false;
    } else {
      this.SearchClicked = true;
    }
  }


  viewItem(item, isUserDrink) {
    this.navCtrl.push(DrinkDetailPage,
      {item: item, isUserDrink});
  }

  loadEditDrink(item) {
	  this.dataService.setEditDrink(item);
	  this.navCtrl.parent.select(2);
  }

  loadAddDrink() {
    this.navCtrl.parent.select(2);
  }

  deleteDrink(item) {
	this.dataService.deleteRecipe(item);
	this.userRecipes = this.dataService.getUserDrinks();
  }

  UserDatabaseItems() {

    this.items = this.userRecipes.sort();
	this.searchedRecipes = this.allRecipes.sort();
	this.topDrinksSearch = this.topRecipes.sort();
  }


  getItems(ev) {

    this.UserDatabaseItems();

    const val = ev.target.value;


    if (this.segment == "0" && val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })

    }
	if (this.segment == "1" && val && val.trim() != '') {
      this.topDrinksSearch = this.topDrinksSearch.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })

    }

	if (this.segment == "2" && val && val.trim() != '') {
      this.searchedRecipes = this.searchedRecipes.filter((item) => {
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);

      })

    }


  }


}
