import { Component } from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import { Data } from '../../providers/data';
import { EditRecipePage } from '../editRecipe/editRecipe';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-editUserIngredient',
  templateUrl: 'editUserIngredient.html',
})

export class EditUserIngredientPage {
  id: string = "";
  name: string = "";
  brand: string = "";
  servingSizeAmt: number = 1;
  calories: number = 0;
  caloriesFromFat: number = 0;
  totalCarbs: number = 0;
  cholesterol: number = 0;
  satFat: number = 0
  transFat: number = 0;
  totalFat: number = 0;
  sodium: number = 0;
  sugars: number = 0;
  protein: number = 0;
  dietaryFiber: number = 0;
  calcium: number = 0;
  iron: number = 0;
  vitA: number = 0;
  vitC: number = 0;
  alcoholPerServing: number = 0;
  value: any;

  constructor(public navCtrl: NavController,
              public view: ViewController,
              public dataService: Data,
              public navParams: NavParams,
              private alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
      this.loadIngredientValues();
  }

  loadIngredientValues() {
      this.value = this.navParams.get('item');
	  this.id = this.value.id;
      this.name = this.value.name;
      this.brand = this.value.brand;
      this.servingSizeAmt = this.value.ingredientNutFacts.attributes.servingSizeAmt;
      this.calories = this.value.ingredientNutFacts.attributes.calories;
      this.caloriesFromFat = this.value.ingredientNutFacts.attributes.caloriesFromFat;
      this.totalCarbs = this.value.ingredientNutFacts.attributes.totalCarb;
      this.cholesterol = this.value.ingredientNutFacts.attributes.cholesterol;
      this.satFat = this.value.ingredientNutFacts.attributes.satFat;
      this.transFat = this.value.ingredientNutFacts.attributes.transFat;
      this.totalFat = this.value.ingredientNutFacts.attributes.totalFat;
      this.sodium = this.value.ingredientNutFacts.attributes.sodium;
      this.sugars = this.value.ingredientNutFacts.attributes.sugars;
      this.protein = this.value.ingredientNutFacts.attributes.protein;
      this.dietaryFiber = this.value.ingredientNutFacts.attributes.dietaryFiber;
      this.calcium = this.value.ingredientNutFacts.attributes.calcium;
      this.iron = this.value.ingredientNutFacts.attributes.iron;
      this.vitA = this.value.ingredientNutFacts.attributes.vitA;
      this.vitC = this.value.ingredientNutFacts.attributes.vitC;
      this.alcoholPerServing = this.value.ingredientNutFacts.attributes.alcoholPerServing;
  }

  saveIngredient() {
    let editedIngredient = {
	  id: this.id, 
      name: this.name,
      brand: this.brand,
      type: 'I',
      servingSizeAmt: this.servingSizeAmt,
      servingSizeMeas: 'oz',
      calories: this.calories,
      caloriesFromFat: this.caloriesFromFat,
      totalCarbs: this.totalCarbs,
      cholesterol: this.cholesterol,
      satFat: this.satFat,
      transFat: this.transFat,
      totalFat: this.totalFat,
      sodium: this.sodium,
      sugars: this.sugars,
      protein: this.protein,
      dietaryFiber: this.dietaryFiber,
      calcium: this.calcium,
      iron: this.iron,
      vitA: this.vitA,
      vitC: this.vitC,
      alcoholPerServing: this.alcoholPerServing
    }

    this.dataService.editUserIngredient(editedIngredient);
	let alert = this.alertCtrl.create({
		title: 'Ingredient Edited!',
		buttons: [{
			text: 'Ok'
		}]
	});
	alert.present();
    this.navCtrl.pop();
  }
}
