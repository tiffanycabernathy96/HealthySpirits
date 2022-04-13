import { Component } from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import { Data } from '../../providers/data';
import { EditRecipePage } from '../editRecipe/editRecipe';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-addNewIngredient',
  templateUrl: 'addNewIngredient.html',
})

export class AddNewIngredientPage {

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

  constructor(public navCtrl: NavController, public view: ViewController, public dataService: Data,
        private alertCtrl: AlertController) {

  }

  addNewIngredient() {
    let newIngredient = {
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
    this.dataService.addUserIngredient(newIngredient);
    
    this.navCtrl.pop();
  }

}
