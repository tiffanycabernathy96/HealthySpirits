import { Component } from '@angular/core';
import {NavParams, NavController, PopoverController} from 'ionic-angular';
import { Data } from '../../providers/data';
import {ToastController} from "ionic-angular";
import { Clipboard } from '@ionic-native/clipboard';
import {EditRecipePage} from "../editRecipe/editRecipe";
import {SocialSharing} from "@ionic-native/social-sharing/ngx";


@Component({
  selector: 'page-drinkDetail',
  templateUrl: 'drinkDetail.html'
})
export class DrinkDetailPage
{
	public allIngredients = [];
	public userIngredients = [];
	public drink;
	name;
  isUsers:boolean;
	likes:number;
	dislikes:number;
	userLiked:boolean;
	userDisliked:boolean;
  isUserDrink:string;
    public NotGuestMode;

	text:string;

	public drinkIngredientIDs = [];
	public drinkIngredients =[];
	public drinkNutritionalInformation = [];
	drinkIngredientAmounts = [];
	drinkIngredientDetails = [];
	servingSizeAmt :number;
	servingSizeMeas:number;
	calories:number;
	caloriesFromFat:number;
	totalFat:number;
	satFat:number;
	transFat:number;
	cholesterol:number;
	sodium:number;
	totalCarb:number;
	dietaryFiber:number;
	sugars:number;
	protein:number;
	vitA:number;
	vitC:number;
	calcium:number;
	iron:number;
	alcoholPerServing:number;
	img;
	imgExists:boolean;
	multiplyBy:number;
	size : number;

	constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public dataService: Data,
              public popoverCtrl: PopoverController,
              private toastCtrl: ToastController,
              private clipboard: Clipboard,
              private socialSharing: SocialSharing)
	{
        
	}

	ionViewWillEnter()
	{
		this.drink = this.navParams.get('item');
		this.name = this.navParams.get('item').name;
        this.dataService.drinkLikes(this.drink.id).then(result => {this.likes = result});
        this.dataService.drinkDislikes(this.drink.id).then(result => {this.dislikes = result});
        this.userLiked = this.dataService.hasUserLikedRecipe(this.drink.id);
        this.userDisliked = this.dataService.hasUserDislikedRecipe(this.drink.id);
        this.checkLikeDislike();
        this.checkLike();
        this.checkDislike();
		this.drinkIngredientIDs = this.navParams.get('item').recipeIngredients;
		this.allIngredients = this.dataService.getPossibleIngredients();
		this.userIngredients = this.dataService.getUserCreatedIngredients();
		this.servingSizeAmt = this.drink.servingSizeAmt;
        this.NotGuestMode = this.dataService.getNotGuestMode();
		this.servingSizeMeas = this.drink.servingSizeMeas;

		this.drinkIngredientAmounts = this.drink.recipeIngredientAmts;
		this.size = this.drink.servingSizeAmt;

    this.isUserDrink = this.navParams.get('isUserDrink')

		this.calculateNutrition();
		for(var i = 0; i < this.drinkIngredientIDs.length; i++)
		{
			for(var y = 0; y < this.userIngredients.length; y++)
			{
				if(this.userIngredients[y].id == this.drinkIngredientIDs[i])
				{
					this.drinkIngredients.push(this.userIngredients[y]);
					break;
				}
			}
			for(var y = 0; y < this.allIngredients.length; y++)
			{
				if(this.allIngredients[y].id == this.drinkIngredientIDs[i])
				{
					this.drinkIngredients.push(this.allIngredients[y]);
					break;
				}
			}
		}
		for(var i = 0; i < this.drinkIngredients.length; i++)
		{
			this.drinkIngredientDetails.push({name: this.drinkIngredients[i].name, amount: this.drinkIngredientAmounts[i]});
		}
		this.img = this.drink.imgURL;
	}
	calculateNutrition()
	{
		this.multiplyBy = +this.size/+this.servingSizeAmt;
		this.calories = +(this.drink.calories*this.multiplyBy).toFixed(2);
		this.caloriesFromFat = +(this.drink.caloriesFromFat*this.multiplyBy).toFixed(2);
		this.totalFat = +(this.drink.totalFat*this.multiplyBy).toFixed(2);
		this.satFat = +(this.drink.satFat*this.multiplyBy).toFixed(2);
		this.transFat = +(this.drink.transFat*this.multiplyBy).toFixed(2);
		this.cholesterol = +(this.drink.cholesterol*this.multiplyBy).toFixed(2);
		this.sodium = +(this.drink.sodium*this.multiplyBy).toFixed(2);
		this.totalCarb = +(this.drink.totalCarb*this.multiplyBy).toFixed(2);
		this.dietaryFiber = +(this.drink.dietaryFiber*this.multiplyBy).toFixed(2);
		this.sugars = +(this.drink.sugars*this.multiplyBy).toFixed(2);
		this.protein = +(this.drink.protein*this.multiplyBy).toFixed(2);
		this.vitA = +(this.drink.vitA*this.multiplyBy).toFixed(2);
		this.vitC = +(this.drink.vitC*this.multiplyBy).toFixed(2);
		this.calcium = +(this.drink.calcium*this.multiplyBy).toFixed(2);
		this.iron = +(this.drink.iron*this.multiplyBy).toFixed(2);
		this.alcoholPerServing = +(this.drink.alcoholPerServing*this.multiplyBy).toFixed(2);

		for(var i = 0; i < this.drinkIngredientDetails.length; i++)
		{
			this.drinkIngredientDetails[i].amount = (this.drinkIngredientAmounts[i]*this.multiplyBy).toFixed(2);
		}
	}

	createRecipeString()
	{

    this.text = this.name + '\n' +
                this.alcoholPerServing + '% ALC' + '\n' +
                'Serving Size' +  '\t' +this.servingSizeAmt + ' ' + this.servingSizeMeas + '\n' +
                'Calories' + '\t' + this.calories + '\n' +
                'Calories From Fat' + '\t' + this.caloriesFromFat + '\n' +
                '\n' +
                'Total Fat' + '\t' + this.totalFat + 'g' + '\n' +
                'Saturated Fat' + '\t' + this.satFat + 'g' + '\n' +
                'Trans Fat' + '\t' + this.transFat + 'g' + '\n' +
                'Cholesterol' + '\t' + this.cholesterol + 'mg' + '\n' +
                'Sodium' + '\t' + this.sodium + 'mg' + '\n' +
                'Total Carbs' + '\t' + this.totalCarb + 'g' + '\n' +
                'Dietary Fiber' + '\t' + this.dietaryFiber + 'g' + '\n' +
                'Sugars' + '\t' + this.sugars + 'g' + '\n' +
                'Protein' + '\t' + this.protein + 'g' + '\n' +
                '\n' +
                'Vitamin A' + '\t' + this.vitA + '%' + '\n' +
                'Vitamin C' + '\t' + this.vitC + '%' + '\n' +
                'Calcium' + '\t' + this.calcium + '%' + '\n' +
                'Iron' + '\t' + this.iron + '%';

	}

	copyToClipboard()
	{

		this.createRecipeString();

		console.log("Copy to Clipboard");
		console.log(this.text);

		this.clipboard.copy(this.text);

		let toast = this.toastCtrl.create({
			message: 'Copied to Clipboard',
			duration: 3000,
			position: 'top'
		});

		toast.present();
	}

	like()
	{
		console.log("Drink liked");
		if(this.userLiked == true && this.userDisliked == true)
		{
			this.dataService.removeDrinkFromLiked(this.drink.id);
			this.dataService.removeDrinkFromDisliked(this.drink.id);
			this.userDisliked = false;
			this.userLiked = false;
			document.getElementById('btn1').style.backgroundColor='#4d4d4d';
			document.getElementById('btn2').style.backgroundColor='#4d4d4d';
		}
		if(this.userLiked == false)
		{
			this.dataService.likeRecipe(this.drink.id);
			this.userLiked = true;
			this.likes = this.likes + 1;
			document.getElementById('btn1').style.backgroundColor='Green';
		}
		else if(this.userLiked == true)
		{
			this.likes = this.likes -1;
			this.userLiked = false;
			this.dataService.unLikeRecipe(this.drink.id);
			this.dataService.removeDrinkFromLiked(this.drink.id);
			document.getElementById('btn1').style.backgroundColor='#4d4d4d';
		}
		if(this.userDisliked == true)
		{
			this.dislikes = this.dislikes -1;
			this.userDisliked = false;
			this.dataService.unDislikeRecipe(this.drink.id);
			this.dataService.removeDrinkFromDisliked(this.drink.id);
			document.getElementById('btn2').style.backgroundColor='#4d4d4d';
		}
		if(this.likes<=0)
		{
			this.likes = 0;
		}
		if(this.dislikes<=0)
		{
			this.dislikes = 0;
		}
	}
	dislike()
	{
		console.log("Drink disliked");
		if(this.userLiked == true && this.userDisliked == true)
		{
			this.dataService.removeDrinkFromLiked(this.drink.id);
			this.dataService.removeDrinkFromDisliked(this.drink.id);
			this.userDisliked = false;
			this.userLiked = false;
			document.getElementById('btn1').style.backgroundColor='#4d4d4d';
			document.getElementById('btn2').style.backgroundColor='#4d4d4d';
		}
		if(this.userDisliked == false)
		{
			this.dataService.dislikeRecipe(this.drink.id);
			this.userDisliked = true;
			this.dislikes = this.dislikes + 1;
			document.getElementById('btn2').style.backgroundColor='Red';
		}
		else if(this.userDisliked == true)
		{
			this.dislikes = this.dislikes -1;
			this.userDisliked = false;
			this.dataService.unDislikeRecipe(this.drink.id);
			this.dataService.removeDrinkFromDisliked(this.drink.id);
			document.getElementById('btn2').style.backgroundColor='#4d4d4d';
		}
		if(this.userLiked == true)
		{
			this.likes = this.likes -1;
			this.userLiked = false;
			this.dataService.unLikeRecipe(this.drink.id);
			this.dataService.removeDrinkFromLiked(this.drink.id);
			document.getElementById('btn1').style.backgroundColor='#4d4d4d';
		}
		if(this.likes<=0)
		{
			this.likes = 0;
		}
		if(this.dislikes<=0)
		{
			this.dislikes = 0;
		}
	}
    checkLikeDislike()
    {

        if (this.userLiked == true && this.userDisliked == true)
        {
            document.getElementById('btn1').style.backgroundColor='#4d4d4d';
            document.getElementById('btn2').style.backgroundColor='#4d4d4d';
            this.dataService.removeDrinkFromLiked(this.drink.id);
            this.dataService.removeDrinkFromDisliked(this.drink.id);
            this.userLiked = false;
            this.userDisliked = false;
        }
    }
    checkLike()
    {
        if (this.userLiked == true)
        {
            document.getElementById('btn1').style.backgroundColor='Green';
            this.likes = this.likes + 1;
        }
        else
        {
            document.getElementById('btn1').style.backgroundColor='#4d4d4d';
        }
    }
    checkDislike()
    {
        if (this.userDisliked == true)
        {
            document.getElementById('btn2').style.backgroundColor='Red';
            this.dislikes = this.dislikes + 1;
        }
        else
        {
            document.getElementById('btn2').style.backgroundColor='#4d4d4d';
        }
    }

	sendForEdit(){
    this.navCtrl.push(EditRecipePage, {item: this.drink});
  }
}
