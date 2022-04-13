import { Storage } from '@ionic/storage';
import { Injectable } from '@angular/core';
import { Parse } from 'parse';
@Injectable()
export class Data {

	private parseAppId: string = '6b1n6d28r7OCM5quYKy4eJNNQiWtYjSwne3T76La';
	private parseJSKey: string = 'WxoDvGe3BLoZoYCZy6oEMc5OyL0TZ9YbItrCp9mt';
	private parseServerUrl: string= 'https://parseapi.back4app.com/';
	public currentUser;
    public NotGuestMode;

	//This is a list of all the recipes created by users.
	//Once user is set, then userDrinks will be populated.
	public allUserRecipes=[];
	public allUserIngredients=[];

	//This is the recipes the current user has created
	public userDrinks=[];

	//List of Recipe IDs the current user has liked
	public userLikes=[];

	//List of Recipe IDs the current user has disliked
	public userDislikes=[];

	//List of Ingredients the current user has created
	public userIngredients=[];

	//This is common recipes we have added to the database
	public staffDrinks=[];

	//This will eventually be drinks that have highest ratings for now it is just going
	//to be the drinks we choose
	public topDrinks=[];

	//Top Drink for the Day
	public dailyTopDrink;

	//Just a list of all possible ingredients.
	public ingredients=[];

	//This is the nutrition labels for all the ingredients
	public ingredientNutritionInformation =[];

	//This is the nutrition labels for all the recipes
	public drinkNutritionInformation=[];
	
	public drinkForEdit;

	constructor(public storage: Storage) {
		Parse.initialize(this.parseAppId, this.parseJSKey);
		Parse.serverURL = this.parseServerUrl;
		this.grabAllData();
	}
	grabAllData()
	{
		this.loadNutritionInfo().then((nutrIn) =>
		{
			this.loadRecipeInfo().then((recipes) =>
			{
				this.loadIngredients().then((recipes) =>
				{
					this.loadTopDrink();
				});
			});
		});
	}
	async loadNutritionInfo()
	{
		const NutritionInformation = Parse.Object.extend('NutritionInformation');
		let niquery = new Parse.Query(NutritionInformation);
		niquery.limit(1000);
		var self =this;
		await niquery.find({
			success: function(nutritionLabels) {
				for (var i = 0; i < nutritionLabels.length; i++){
					var theNutLabel = {
						id: nutritionLabels[i].id,
						servingSizeAmt: nutritionLabels[i].get("servingSizeAmt"),
						servingSizeMeas: nutritionLabels[i].get("servingSizeMeas"),
						calories: nutritionLabels[i].get("calories"),
						caloriesFromFat: nutritionLabels[i].get("caloriesFromFat"),
						totalFat: nutritionLabels[i].get("totalFat"),
						satFat: nutritionLabels[i].get("satFat"),
						transFat: nutritionLabels[i].get("transFat"),
						cholesterol: nutritionLabels[i].get("cholesterol"),
						sodium: nutritionLabels[i].get("sodium"),
						totalCarb: nutritionLabels[i].get("totalCarb"),
						dietaryFiber: nutritionLabels[i].get("dietaryFiber"),
						sugars: nutritionLabels[i].get("sugars"),
						protein: nutritionLabels[i].get("protein"),
						vitA: nutritionLabels[i].get("vitA"),
						vitC: nutritionLabels[i].get("vitC"),
						calcium: nutritionLabels[i].get("calcium"),
						iron: nutritionLabels[i].get("iron"),
						alcoholPerServing: nutritionLabels[i].get("alcoholPerServing"),
						type: nutritionLabels[i].get("type")
					}

					if(theNutLabel.type == "I")
					{
						self.ingredientNutritionInformation.push(theNutLabel);
					}
					else//Recipe
					{
						self.drinkNutritionInformation.push(theNutLabel);
					}
				}
			},
			error: function(error){
				alert("Error Loading Nutrition Information");
			}
		});
		return Promise.resolve(self.ingredientNutritionInformation);
	}
	async loadRecipeInfo()
	{
		const Recipe = Parse.Object.extend('Recipe');
		let rquery = new Parse.Query(Recipe);
		rquery.limit(1000);
		var self =this;
		await rquery.find({
			success: function(recipes) {
				for (var i = 0; i < recipes.length; i++){
					var nutritionInformation;
					for(var b = 0; b < self.drinkNutritionInformation.length; b++)
					{
						if(recipes[i].get("NutritionFacts").id == self.drinkNutritionInformation[b].id)
						{
							nutritionInformation = self.drinkNutritionInformation[b];
						}
					}
					var theRecipe = {
						id: recipes[i].id,
						name: recipes[i].get("name"),
						likes: recipes[i].get("likes"),
						dislikes: recipes[i].get("dislikes"),
						creator: recipes[i].get("creator"),
						recipeIngredients: recipes[i].get("Ingredients"),
						recipeIngredientAmts: recipes[i].get("IngredientAmt"),
						servingSizeAmt: nutritionInformation.servingSizeAmt,
						servingSizeMeas: nutritionInformation.servingSizeMeas,
						calories: nutritionInformation.calories,
						caloriesFromFat: nutritionInformation.caloriesFromFat,
						totalFat: nutritionInformation.totalFat,
						satFat: nutritionInformation.satFat,
						transFat: nutritionInformation.transFat,
						cholesterol: nutritionInformation.cholesterol,
						sodium: nutritionInformation.sodium,
						totalCarb: nutritionInformation.totalCarb,
						dietaryFiber: nutritionInformation.dietaryFiber,
						sugars: nutritionInformation.sugars,
						protein: nutritionInformation.protein,
						vitA: nutritionInformation.vitA,
						vitC: nutritionInformation.vitC,
						calcium: nutritionInformation.calcium,
						iron: nutritionInformation.iron,
						alcoholPerServing: nutritionInformation.alcoholPerServing,
						topPick: recipes[i].get("topPick"),
						imgURL: recipes[i].get("imgURL")
					}
					if(theRecipe.creator == "HS")
					{
						self.staffDrinks.push(theRecipe);
						if(theRecipe.topPick == true)
						{
							self.topDrinks.push(theRecipe);
						}
					}
					else
					{
						self.allUserRecipes.push(theRecipe);
					}
				}
			},
			error: function(error){
				alert("Error Loading Recipes");
			}
		});
		return Promise.resolve(self.staffDrinks);
	}
	async loadIngredients()
	{
		const Ingredient = Parse.Object.extend('Ingredient');
		let iquery = new Parse.Query(Ingredient);
		iquery.limit(1000);
		var self =this;
		await iquery.find({
			success: function(ingredients) {
				for (var i = 0; i < ingredients.length; i++){
					var theIngredient = {
						id: ingredients[i].id,
						name: ingredients[i].get("name"),
						brand: ingredients[i].get("brand"),
						ingredientNutFacts: ingredients[i].get("NutritionFacts"),
						type: ingredients[i].get("Type"),
						creator: ingredients[i].get("creator")
					}
					if(theIngredient.creator == "HS")
					{
						self.ingredients.push(theIngredient);
					}
					else
					{
						self.allUserIngredients.push(theIngredient);
					}
				}
			},
			error: function(error){
				alert("Error Loading Ingredients");
			}
		});
		return Promise.resolve(self.ingredients);
	}
	async loadTopDrink()
	{
		const TopDrink = Parse.Object.extend('TopDrink');
		let iquery = new Parse.Query(TopDrink);
		var self =this;
		await iquery.first({
			success: function(topdrink) {
				let today = new Date();
				if(today.getDate() != topdrink.attributes.daySet)
				{
					let index = Math.floor(Math.random() * (self.topDrinks.length - 1));
					topdrink.set('daySet', today.getDate());
					const Recipe = Parse.Object.extend('Recipe');
					let query = new Parse.Query(Recipe);
					query.equalTo("objectId", self.topDrinks[index].id);
					query.first({
						success: function(data){
							topdrink.set('TopDrinkForDay', data);
						}
					});
					topdrink.save(null, {});
					self.dailyTopDrink = self.topDrinks[index];
				}
				else
				{
					for(var q = 0; q < self.topDrinks.length; q++)
					{
						if(self.topDrinks[q].id == topdrink.attributes.TopDrinkForDay.id)
						{
							self.dailyTopDrink = self.topDrinks[q];
						}
					}
				}
			},
			error: function(error){}
		});
		return Promise.resolve(self.dailyTopDrink);
	}

	//Only used for when signing in
	async setCurrentUser(user)
	{
		this.currentUser = user;
		//Populates the users drinks they created.
		for(var i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].creator == this.currentUser.attributes.username)
			{
				this.userDrinks.push(this.allUserRecipes[i]);
			}
		}
		//Populates the ingredients they created.
		for(var i = 0; i < this.allUserIngredients.length; i++)
		{
			if(this.allUserIngredients[i].creator == this.currentUser.attributes.username)
			{
				this.userIngredients.push(this.allUserIngredients[i]);
			}
		}
		this.userLikes = this.currentUser.attributes.recipesLiked;
		this.userDislikes = this.currentUser.attributes.recipesDisliked;
	}
    setNotGuestMode(NotGuestMode)
    {
        this.NotGuestMode = NotGuestMode;
    }
    getNotGuestMode()
    {
        return this.NotGuestMode;
    }

	//Used to retrieve user information
	getCurrentUser()
	{
		//This will return the user.
		//this.user = this.dataService.getCurrentUser();
		//Then populate all of the variables with the information
		//How to Access the information for the user:
		//user.attributes.username or user.attributes.email etc
		return this.currentUser;
	}

	//Used to save user information after profile has been edited.
	updateCurrentUser(newInfo)
	{
		//This is what you should have :
		//pass in the new user
		/*let updatedUser = {
		id: this.user.id,
		email: this.email,
		username: this.username,
		password: this.password
		};*/
		//this.dataService.updateCurrentUser(updatedUser);

		this.currentUser.set('username', newInfo.username);
		this.currentUser.set('password', newInfo.password);
		this.currentUser.set('email', newInfo.email);
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser){
			tempCurrentUser.set('username', newInfo.username);
			tempCurrentUser.set('password', newInfo.password);
			tempCurrentUser.set('email', newInfo.email);
			tempCurrentUser.save(null, {
				success: function(newProfile)
				{
					console.log("Saved");
				},
				error: function(response, error)
				{
					alert(error.code+' Failed to Save Profile ' + error.message);
				}
			});
		}
	}

	//Drinks created by the user
	getUserDrinks()
	{

		//This is what you should have :
		//this.userDrinks = this.data.getUserDrinks();

		//Database Code
		return this.userDrinks;

	}

	//Drinks created by us
	getStaffDrinks()
	{
		//This is what you should have :
		//this.staffDrinks = this.data.getStaffDrinks();

		//Database Code
		return this.staffDrinks;
	}

	//Have a boolean value to determine if it is top under recipe.
	//if drink.topDrink add it to topDrinks
	//Eventually these drinks will be based on how high they are rated. Next //Semester
	getTopDrinks()
	{
		//This is what you should have :
		//this.topDrinks = this.data.getTopDrinks();

		//Database Code
		return this.topDrinks;
	}

	//Returns the top drink of the day. 
	getTopDrink()
	{
		return this.dailyTopDrink;
	}
	//A List of all the possible ingredients that can be in a drink
	getPossibleIngredients()
	{
		//This is what you should have :
		//this.allPossibleIngredients = this.data.getPossibleIngredients();

		//Database Code
		return this.ingredients;
	}
	getUserCreatedIngredients()
	{
		//This is what you should have :
		//this.userCreatedIngredients = this.data.getUserCreatedIngredients();

		//Database Code
		return this.userIngredients;
	}
	setEditDrink(item)
	{
		this.drinkForEdit = item;
	}
	getEditDrink()
	{
		return this.drinkForEdit;
	}
	async addUserDrink(drink)
	{
		//drink should contain name, list ingredients, list of nutrition values
		//This is what you should have :
		//NOTE: Make sure to write this. infront of all the variable names mentioned below
		/*let newDrink = {
		name: [VARIABLE YOU HAVE FOR DRINK NAME],
		likes: 0,
		dislikes: 0,
		Ingredients: this.[ARRAY NAME OF INGREDIENTS YOU HAVE STORED THAT HAVE BEEN ADDED TO THE DRINK],
		IngredientAmmounts: this.[ARRAY OF INGREDIENT AMOUNTS NAME]
		};*/
		//this.data.addUserDrink(newDrink);
		var servingSizeAmt : number = 0;
		var servingSizeMeas = "oz";
		var calories : number = 0;
		var caloriesFromFat : number = 0;
		var totalFat : number = 0;
		var satFat : number = 0;
		var transFat : number = 0;
		var cholesterol : number = 0;
		var sodium : number = 0;
		var totalCarb : number = 0;
		var dietaryFiber : number = 0;
		var sugars : number = 0;
		var protein : number = 0;
		var vitA : number = 0;
		var vitC : number = 0;
		var calcium : number = 0;
		var iron : number = 0;
		var alcoholPerServing : number = 0;

		let self = this;

		//Database Code
		var nutritionInfoID;
		for(var i = 0; i < drink.Ingredients.length; i++)
		{
			var amount : number = drink.IngredientAmounts[i];
			var ingredient = drink.Ingredients[i];

			var amtInDrink : number = amount/ingredient.ingredientNutFacts.attributes.servingSizeAmt;
			servingSizeAmt = +amount + +servingSizeAmt;
			calories += ingredient.ingredientNutFacts.attributes.calories*amtInDrink;
			caloriesFromFat += ingredient.ingredientNutFacts.attributes.caloriesFromFat*amtInDrink;
			totalFat += ingredient.ingredientNutFacts.attributes.totalFat*amtInDrink;
			satFat += ingredient.ingredientNutFacts.attributes.satFat*amtInDrink;
			transFat += ingredient.ingredientNutFacts.attributes.transFat*amtInDrink;
			cholesterol += ingredient.ingredientNutFacts.attributes.cholesterol*amtInDrink;
			sodium += ingredient.ingredientNutFacts.attributes.sodium*amtInDrink;
			totalCarb += ingredient.ingredientNutFacts.attributes.totalCarb*amtInDrink;
			dietaryFiber += ingredient.ingredientNutFacts.attributes.dietaryFiber*amtInDrink;
			sugars += ingredient.ingredientNutFacts.attributes.sugars*amtInDrink;
			protein += ingredient.ingredientNutFacts.attributes.protein*amtInDrink;
			vitA += ingredient.ingredientNutFacts.attributes.vitA*amtInDrink;
			vitC += ingredient.ingredientNutFacts.attributes.vitC*amtInDrink;
			calcium += ingredient.ingredientNutFacts.attributes.calcium*amtInDrink;
			iron += ingredient.ingredientNutFacts.attributes.iron*amtInDrink;
			alcoholPerServing += ingredient.ingredientNutFacts.attributes.alcoholPerServing*amtInDrink;
		}
		const NutritionInformation = Parse.Object.extend('NutritionInformation');
		let newNutInfo = new NutritionInformation();
		newNutInfo.set("servingSizeAmt", servingSizeAmt);
		newNutInfo.set("servingSizeMeas",servingSizeMeas);
		newNutInfo.set("calories", calories);
		newNutInfo.set("caloriesFromFat", caloriesFromFat);
		newNutInfo.set("totalFat", totalFat);
		newNutInfo.set("satFat", satFat);
		newNutInfo.set("transFat", transFat);
		newNutInfo.set("cholesterol",cholesterol);
		newNutInfo.set("sodium", sodium);
		newNutInfo.set("totalCarb", totalCarb);
		newNutInfo.set("dietaryFiber", dietaryFiber);
		newNutInfo.set("sugars", sugars);
		newNutInfo.set("protein",protein);
		newNutInfo.set("vitA", vitA);
		newNutInfo.set("vitC", vitC);
		newNutInfo.set("calcium", calcium);
		newNutInfo.set("iron", iron);
		newNutInfo.set("alcoholPerServing", alcoholPerServing);
		newNutInfo.set("type", "D");
		await newNutInfo.save(null, {
			success: function(newNutInfo)
			{
				nutritionInfoID = newNutInfo.id;
			},
			error: function(newNutInfo, error)
			{
				alert(error.code+' Failed to Add Nutritional Information');
			}
		}).then(_ =>
		{
			var ingredientIDS = [];
			var ingredientAmts =[];
			var nutritionInfoPtr;
			for(var b = 0; b < drink.Ingredients.length; b++)
			{
				ingredientIDS.push(drink.Ingredients[b].id);
			}
			const RNI = Parse.Object.extend('NutritionInformation');
			var query = new Parse.Query(RNI);
			query.equalTo("objectId", nutritionInfoID);
			query.first({
				success: function (object) {
				nutritionInfoPtr = object;
			}}).then(_ =>
			{
			for(var c = 0; c < drink.IngredientAmounts.length; c++)
			{
			ingredientAmts.push(+drink.IngredientAmounts[c]);
			}
			const Recipe = Parse.Object.extend('Recipe');
			let newRecipe = new Recipe();
			newRecipe.set("name", drink.name);
			newRecipe.set("likes",drink.likes);
			newRecipe.set("dislikes", drink.dislikes);
			newRecipe.set("creator", this.currentUser.attributes.username);
			newRecipe.set("Ingredients", ingredientIDS);
			newRecipe.set("IngredientAmt", ingredientAmts);
			newRecipe.set("NutritionFacts", nutritionInfoPtr);
			newRecipe.save(null, {
				success: function(newRecipe)
				{
					var theNewRecipe = {
						id: newRecipe.id,
						name: newRecipe.attributes.name,
						likes: newRecipe.attributes.likes,
						dislikes: newRecipe.attributes.dislikes,
						creator: newRecipe.attributes.creator,
						Ingredients: newRecipe.attributes.Ingredients,
						IngredientAmt: newRecipe.attributes.IngredientAmt,
						NutritionFacts: newRecipe.attributes.NutritionFacts
					}
					var theRecipe = {
						id: theNewRecipe.id,
						name: theNewRecipe.name,
						likes: theNewRecipe.likes,
						dislikes: theNewRecipe.dislikes,
						creator: theNewRecipe.creator,
						recipeIngredients: theNewRecipe.Ingredients,
						recipeIngredientAmts: theNewRecipe.IngredientAmt,
						servingSizeAmt: servingSizeAmt,
						servingSizeMeas: servingSizeMeas,
						calories: calories,
						caloriesFromFat: caloriesFromFat,
						totalFat: totalFat,
						satFat: satFat,
						transFat: transFat,
						cholesterol: cholesterol,
						sodium: sodium,
						totalCarb: totalCarb,
						dietaryFiber: dietaryFiber,
						sugars: sugars,
						protein: protein,
						vitA: vitA,
						vitC: vitC,
						calcium: calcium,
						iron: iron,
						alcoholPerServing: alcoholPerServing
					}
					self.userDrinks.push(theRecipe);
				},
				error: function(newRecipe, error)
				{
					alert(error.code+' Failed to Add Recipe ' + newRecipe.get("name"));
				}
				});
			})
		});
	}

	async updateUserDrink(drink)
	{
		//Do exactly the same thing for addUserDrink except call updateUserDrink and make sure to pass in the id. this is VERY important.
		//So along the lines of:
		/*
		let newDrink = {
		id: [VARIABLE NAME FOR DRINK ID]
		name: [VARIABLE NAME FOR DRINK YOU HAVE]
		etc
		}
		this.data.updateUserDrink(newDrink);
		*/

		//Datebase Code
		var servingSizeAmt : number = 0;
		var servingSizeMeas = "oz";
		var calories : number = 0;
		var caloriesFromFat : number = 0;
		var totalFat : number = 0;
		var satFat : number = 0;
		var transFat : number = 0;
		var cholesterol : number = 0;
		var sodium : number = 0;
		var totalCarb : number = 0;
		var dietaryFiber : number = 0;
		var sugars : number = 0;
		var protein : number = 0;
		var vitA : number = 0;
		var vitC : number = 0;
		var calcium : number = 0;
		var iron : number = 0;
		var alcoholPerServing : number = 0;

		let self = this;

		//Database Code
		var nutritionInfoID;
		for(var i = 0; i < drink.Ingredients.length; i++)
		{
			var amount : number = drink.IngredientAmounts[i];
			var ingredient = drink.Ingredients[i];

			var amtInDrink : number = amount/ingredient.ingredientNutFacts.attributes.servingSizeAmt;
			servingSizeAmt = +amount + +servingSizeAmt;
			calories += ingredient.ingredientNutFacts.attributes.calories*amtInDrink;
			caloriesFromFat += ingredient.ingredientNutFacts.attributes.caloriesFromFat*amtInDrink;
			totalFat += ingredient.ingredientNutFacts.attributes.totalFat*amtInDrink;
			satFat += ingredient.ingredientNutFacts.attributes.satFat*amtInDrink;
			transFat += ingredient.ingredientNutFacts.attributes.transFat*amtInDrink;
			cholesterol += ingredient.ingredientNutFacts.attributes.cholesterol*amtInDrink;
			sodium += ingredient.ingredientNutFacts.attributes.sodium*amtInDrink;
			totalCarb += ingredient.ingredientNutFacts.attributes.totalCarb*amtInDrink;
			dietaryFiber += ingredient.ingredientNutFacts.attributes.dietaryFiber*amtInDrink;
			sugars += ingredient.ingredientNutFacts.attributes.sugars*amtInDrink;
			protein += ingredient.ingredientNutFacts.attributes.protein*amtInDrink;
			vitA += ingredient.ingredientNutFacts.attributes.vitA*amtInDrink;
			vitC += ingredient.ingredientNutFacts.attributes.vitC*amtInDrink;
			calcium += ingredient.ingredientNutFacts.attributes.calcium*amtInDrink;
			iron += ingredient.ingredientNutFacts.attributes.iron*amtInDrink;
			alcoholPerServing += ingredient.ingredientNutFacts.attributes.alcoholPerServing*amtInDrink;
		}
		var ingredientIDS = [];
		var ingredientAmts =[];
		for(var b = 0; b < drink.Ingredients.length; b++)
		{
			ingredientIDS.push(drink.Ingredients[b].id);
		}
		for(var c = 0; c < drink.IngredientAmounts.length; c++)
		{
			ingredientAmts.push(+drink.IngredientAmounts[c]);
		}

		var theRecipe = {
			id: drink.id,
			name: drink.name,
			likes: drink.likes,
			dislikes: drink.dislikes,
			creator: drink.creator,
			recipeIngredients: ingredientIDS,
			recipeIngredientAmts: ingredientAmts,
			servingSizeAmt: servingSizeAmt,
			servingSizeMeas: servingSizeMeas,
			calories: calories,
			caloriesFromFat: caloriesFromFat,
			totalFat: totalFat,
			satFat: satFat,
			transFat: transFat,
			cholesterol: cholesterol,
			sodium: sodium,
			totalCarb: totalCarb,
			dietaryFiber: dietaryFiber,
			sugars: sugars,
			protein: protein,
			vitA: vitA,
			vitC: vitC,
			calcium: calcium,
			iron: iron,
			alcoholPerServing: alcoholPerServing
		}
		for(var z = 0; z < this.userDrinks.length; z++)
		{
			if(this.userDrinks[z].id == drink.id)
			{
				this.userDrinks[z] = theRecipe;
				break;
			}
		}

		const Recipe = Parse.Object.extend('Recipe');
		let query = new Parse.Query(Recipe);
		query.equalTo("objectId", drink.id);
		await query.first({
			success: function(data){
				if(data){
					data.set("name", drink.name);
					data.set("Ingredients", ingredientIDS);
					data.set("IngredientAmt", ingredientAmts);

					data.attributes.NutritionFacts.set("servingSizeAmt", servingSizeAmt);
					data.attributes.NutritionFacts.set("servingSizeMeas",servingSizeMeas);
					data.attributes.NutritionFacts.set("calories", calories);
					data.attributes.NutritionFacts.set("caloriesFromFat", caloriesFromFat);
					data.attributes.NutritionFacts.set("totalFat", totalFat);
					data.attributes.NutritionFacts.set("satFat", satFat);
					data.attributes.NutritionFacts.set("transFat", transFat);
					data.attributes.NutritionFacts.set("cholesterol",cholesterol);
					data.attributes.NutritionFacts.set("sodium", sodium);
					data.attributes.NutritionFacts.set("totalCarb", totalCarb);
					data.attributes.NutritionFacts.set("dietaryFiber", dietaryFiber);
					data.attributes.NutritionFacts.set("sugars", sugars);
					data.attributes.NutritionFacts.set("protein",protein);
					data.attributes.NutritionFacts.set("vitA", vitA);
					data.attributes.NutritionFacts.set("vitC", vitC);
					data.attributes.NutritionFacts.set("calcium", calcium);
					data.attributes.NutritionFacts.set("iron", iron);
					data.attributes.NutritionFacts.set("alcoholPerServing", alcoholPerServing);
					data.attributes.NutritionFacts.set("type", "D");
					data.attributes.NutritionFacts.save(null, {} );
					data.save(null, {});
				}
			}
		});
	}

	async deleteRecipe(drink)
	{
		//in the deleteDrink(item) function just call
		//this.dataService.deleteRecipe(item);
		//this.userRecipes = this.dataService.getUserDrinks();
		//Database Code
		var theDrink;
		for(let i = 0; i < this.userDrinks.length; i++)
		{
			if(this.userDrinks[i].id == drink.id)
			{
				theDrink = this.userDrinks[i];
				break;
			}
		}
		this.userDrinks.splice(this.userDrinks.indexOf(theDrink), 1);

		for(let i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].id == drink.id)
			{
				theDrink = this.allUserRecipes[i];
				break;
			}
		}
		this.allUserRecipes.splice(this.allUserRecipes.indexOf(theDrink), 1);

		const Recipe = Parse.Object.extend('Recipe');
		let query = new Parse.Query(Recipe);
		query.equalTo("objectId", drink.id);
		await query.first({
			success: function(data){
				if(data){
					data.attributes.NutritionFacts.destroy();
					data.destroy();
				} else {
					return null;
				}
			}
		});
	}
	async addUserIngredient(ingredient)
	{
		//ingredient should contain name, brand,type and list of nutrition values
		//This is what you should have :
		//NOTE: Make sure to write this. infront of all the variable names mentioned below
		/*let newIngredient = {
		name: [VARIABLE YOU HAVE FOR INGREDIENT NAME],
		brand: [VARIABLE YOU HAVE FOR INGREDIENT BRAND],
		type: [VARIABLE YOU HAVE FOR INGREDIENT TYPE],
		servingSizeAmt: [VARIABLE YOU HAVE FOR INGREDIENT SERVING SIZE AMOUNT],
		servingSizeMeas: 'oz',
		calories: [VARIABLE YOU HAVE FOR INGREDIENT CALORIES],
		.....
		};*/
		//this.data.addUserIngredient(newIngredient);

		//Database Code
		var servingSizeAmt : number = 0;
		var servingSizeMeas = "oz";
		var calories : number = 0;
		var caloriesFromFat : number = 0;
		var totalFat : number = 0;
		var satFat : number = 0;
		var transFat : number = 0;
		var cholesterol : number = 0;
		var sodium : number = 0;
		var totalCarb : number = 0;
		var dietaryFiber : number = 0;
		var sugars : number = 0;
		var protein : number = 0;
		var vitA : number = 0;
		var vitC : number = 0;
		var calcium : number = 0;
		var iron : number = 0;
		var alcoholPerServing : number = 0;
		var creator = this.currentUser.attributes.username;
		//If serving size amt is not 1 make sure to divide appropriately to get it to 1. 

		calories = ingredient.calories/ingredient.servingSizeAmt;
		caloriesFromFat = ingredient.caloriesFromFat/ingredient.servingSizeAmt;
		totalFat = ingredient.totalFat/ingredient.servingSizeAmt;
		satFat = ingredient.satFat/ingredient.servingSizeAmt;
		transFat = ingredient.transFat/ingredient.servingSizeAmt;
		cholesterol = ingredient.cholesterol/ingredient.servingSizeAmt;
		sodium = ingredient.sodium/ingredient.servingSizeAmt;
		totalCarb = ingredient.totalCarbs/ingredient.servingSizeAmt;
		dietaryFiber = ingredient.dietaryFiber/ingredient.servingSizeAmt;
		sugars = ingredient.sugars/ingredient.servingSizeAmt;
		protein = ingredient.protein/ingredient.servingSizeAmt;
		vitA = ingredient.vitA/ingredient.servingSizeAmt;
		vitC = ingredient.vitC/ingredient.servingSizeAmt;
		calcium = ingredient.calcium/ingredient.servingSizeAmt;
		iron = ingredient.iron/ingredient.servingSizeAmt;
		alcoholPerServing = ingredient.alcoholPerServing/ingredient.servingSizeAmt;
		servingSizeAmt = 1;

		const NutritionInformation = Parse.Object.extend('NutritionInformation');
		let newNutInfo = new NutritionInformation();
		newNutInfo.set("servingSizeAmt", servingSizeAmt);
		newNutInfo.set("servingSizeMeas",servingSizeMeas);
		newNutInfo.set("calories", calories);
		newNutInfo.set("caloriesFromFat", caloriesFromFat);
		newNutInfo.set("totalFat", totalFat);
		newNutInfo.set("satFat", satFat);
		newNutInfo.set("transFat", transFat);
		newNutInfo.set("cholesterol",cholesterol);
		newNutInfo.set("sodium", sodium);
		newNutInfo.set("totalCarb", totalCarb);
		newNutInfo.set("dietaryFiber", dietaryFiber);
		newNutInfo.set("sugars", sugars);
		newNutInfo.set("protein",protein);
		newNutInfo.set("vitA", vitA);
		newNutInfo.set("vitC", vitC);
		newNutInfo.set("calcium", calcium);
		newNutInfo.set("iron", iron);
		newNutInfo.set("alcoholPerServing", alcoholPerServing);
		newNutInfo.set("type", "I");
		var self = this;
		await newNutInfo.save(null, {
			success: function(newNutInfo)
			{
				const IngredientItem = Parse.Object.extend('Ingredient');
				let newIngInfo = new IngredientItem();
				newIngInfo.set("name", ingredient.name);
				newIngInfo.set("brand", ingredient.brand);
				newIngInfo.set("NutritionFacts", newNutInfo);
				newIngInfo.set("Type", "User");
				newIngInfo.set("creator", creator);
				newIngInfo.save(null, {
					success: function(newIngredient)
					{
						var theNewIngredient = {
							id: newIngredient.id,
							name: ingredient.name,
							brand: ingredient.brand,
							ingredientNutFacts: newNutInfo,
							type: "User",
							creator: creator
						}
						self.userIngredients.push(theNewIngredient);
					},
					error: function(error)
					{
						alert(error.code+' Failed to Add Ingredient ');
					}
				});
			},
			error: function(newNutInfo, error)
			{
				alert(error.code+' Failed to Add Nutritional Information');
			}
		});
	}

	async editUserIngredient(ingredient)
	{
		//ingredient should contain name, brand,type and list of nutrition values
		//This is what you should have :
		//NOTE: Make sure to write this. infront of all the variable names mentioned below
		/*let updatedIngredient = {
		id: [VARIABLE YOU HAVE FOR INGREDIENT ID],
		name: [VARIABLE YOU HAVE FOR INGREDIENT NAME],
		brand: [VARIABLE YOU HAVE FOR INGREDIENT BRAND],
		type: [VARIABLE YOU HAVE FOR INGREDIENT TYPE],
		servingSizeAmt: [VARIABLE YOU HAVE FOR INGREDIENT SERVING SIZE AMOUNT],
		servingSizeMeas: 'oz',
		calories: [VARIABLE YOU HAVE FOR INGREDIENT CALORIES],
		.....
		};*/
		//this.data.editUserIngredient(updatedIngredient);

		//Database Code
		var servingSizeAmt : number = 0;
		var servingSizeMeas = "oz";
		var calories : number = 0;
		var caloriesFromFat : number = 0;
		var totalFat : number = 0;
		var satFat : number = 0;
		var transFat : number = 0;
		var cholesterol : number = 0;
		var sodium : number = 0;
		var totalCarb : number = 0;
		var dietaryFiber : number = 0;
		var sugars : number = 0;
		var protein : number = 0;
		var vitA : number = 0;
		var vitC : number = 0;
		var calcium : number = 0;
		var iron : number = 0;
		var alcoholPerServing : number = 0;
		//If serving size amt is not 1 make sure to divide appropriately to get it to 1. 

		calories = ingredient.calories/ingredient.servingSizeAmt;
		caloriesFromFat = ingredient.caloriesFromFat/ingredient.servingSizeAmt;
		totalFat = ingredient.totalFat/ingredient.servingSizeAmt;
		satFat = ingredient.satFat/ingredient.servingSizeAmt;
		transFat = ingredient.transFat/ingredient.servingSizeAmt;
		cholesterol = ingredient.cholesterol/ingredient.servingSizeAmt;
		sodium = ingredient.sodium/ingredient.servingSizeAmt;
		totalCarb = ingredient.totalCarbs/ingredient.servingSizeAmt;
		dietaryFiber = ingredient.dietaryFiber/ingredient.servingSizeAmt;
		sugars = ingredient.sugars/ingredient.servingSizeAmt;
		protein = ingredient.protein/ingredient.servingSizeAmt;
		vitA = ingredient.vitA/ingredient.servingSizeAmt;
		vitC = ingredient.vitC/ingredient.servingSizeAmt;
		calcium = ingredient.calcium/ingredient.servingSizeAmt;
		iron = ingredient.iron/ingredient.servingSizeAmt;
		alcoholPerServing = ingredient.alcoholPerServing/ingredient.servingSizeAmt;
		servingSizeAmt = 1;
		
		const IngredientItem = Parse.Object.extend('Ingredient');
		let query = new Parse.Query(IngredientItem);
		query.equalTo("objectId", ingredient.id);
		
		var self=this;
		await query.first({
			success: function(data){
				if(data){
					data.set("name", ingredient.name);
					data.set("brand", ingredient.brand);
					
					data.attributes.NutritionFacts.set("servingSizeAmt", servingSizeAmt);
					data.attributes.NutritionFacts.set("servingSizeMeas",servingSizeMeas);
					data.attributes.NutritionFacts.set("calories", calories);
					data.attributes.NutritionFacts.set("caloriesFromFat", caloriesFromFat);
					data.attributes.NutritionFacts.set("totalFat", totalFat);
					data.attributes.NutritionFacts.set("satFat", satFat);
					data.attributes.NutritionFacts.set("transFat", transFat);
					data.attributes.NutritionFacts.set("cholesterol",cholesterol);
					data.attributes.NutritionFacts.set("sodium", sodium);
					data.attributes.NutritionFacts.set("totalCarb", totalCarb);
					data.attributes.NutritionFacts.set("dietaryFiber", dietaryFiber);
					data.attributes.NutritionFacts.set("sugars", sugars);
					data.attributes.NutritionFacts.set("protein",protein);
					data.attributes.NutritionFacts.set("vitA", vitA);
					data.attributes.NutritionFacts.set("vitC", vitC);
					data.attributes.NutritionFacts.set("calcium", calcium);
					data.attributes.NutritionFacts.set("iron", iron);
					data.attributes.NutritionFacts.set("alcoholPerServing", alcoholPerServing);
					data.attributes.NutritionFacts.set("type", "I");
					data.attributes.NutritionFacts.save(null, {} );
					
					data.save(null, {});
					var theNewIngredient = {
						id: ingredient.id,
						name: ingredient.name,
						brand: ingredient.brand,
						ingredientNutFacts: data.attributes.NutritionFacts,
						type: "User",
						creator: ingredient.creator
					}
					for(var t = 0; t < self.userIngredients.length; t++)
					{
						if(self.userIngredients[t].id == ingredient.id)
							self.userIngredients[t] = theNewIngredient;
					}
					for(var i = 0; i < self.userDrinks.length; i++)
					{
						for(var q = 0; q < self.userDrinks[i].recipeIngredients.length; q++)
						{
							if(self.userDrinks[i].recipeIngredients[q] == ingredient.id)
							{
								let newDrinkIngredients = [];
								for(var o = 0; o < self.userDrinks[i].recipeIngredients.length; o++)
								{
									newDrinkIngredients.push(self.getIngredientFromID(self.userDrinks[i].recipeIngredients[o]));
								}
								let drink = {
									id: self.userDrinks[i].id,
									name: self.userDrinks[i].name,
									likes: self.userDrinks[i].likes,
									dislikes: self.userDrinks[i].dislikes,
									Ingredients: newDrinkIngredients,
									IngredientAmounts: self.userDrinks[i].recipeIngredientAmts
								};
								self.updateUserDrink(drink);
							}
						}
					}
				}
			}
		});
	}
	async deleteUserIngredient(ingredient)
	{
		//ingredient should contain just the ingredient in which the user wants deleted. 
		//This is what you should have :
		//this.data.deleteUserIngredient(ingredient);

		//Database Code
		var recipesToBeDeleted = [];
		for(var i = 0; i < this.userDrinks.length; i++)
		{
			for(var q = 0; q < this.userDrinks[i].recipeIngredients.length; q++)
			{
				if(this.userDrinks[i].recipeIngredients[q] == ingredient.id)
				{
					//If the ingredient being deleted is the only ingredient, delete the entire recipe
					if(this.userDrinks[i].recipeIngredients.length == 1)
					{
						recipesToBeDeleted.push(this.userDrinks[i]);
					}
					else
					{
						
						//Otherwise, remove the ingredient amt associated with the ingredient and the ingredient itself
						//Then update the recipe with the new ingredients and ingredient amounts
						let index = this.userDrinks[i].recipeIngredients.indexOf(ingredient.id);
						this.userDrinks[i].recipeIngredientAmts.splice(index,1);
						this.userDrinks[i].recipeIngredients.splice(index,1);
						let newDrinkIngredients = [];
						for(var o = 0; o < this.userDrinks[i].recipeIngredients.length; o++)
						{
							newDrinkIngredients.push(this.getIngredientFromID(this.userDrinks[i].recipeIngredients[o]));
						}
						let drink = {
							id: this.userDrinks[i].id,
							name: this.userDrinks[i].name,
							likes: this.userDrinks[i].likes,
							dislikes: this.userDrinks[i].dislikes,
							Ingredients: newDrinkIngredients,
							IngredientAmounts: this.userDrinks[i].recipeIngredientAmts
						};
						this.updateUserDrink(drink);
					}
				}
			}
		}
		while(recipesToBeDeleted.length > 0)
		{
			this.deleteRecipe(recipesToBeDeleted[recipesToBeDeleted.length-1]);
			recipesToBeDeleted.splice(recipesToBeDeleted.length-1, 1);
		}
		
		//Delete the Ingredient From the Database
		const Ingredient = Parse.Object.extend('Ingredient');
		let query = new Parse.Query(Ingredient);
		query.equalTo("objectId", ingredient.id);
		await query.first({
			success: function(data){
				if(data){
					//Delete the Nutrition Facts Associated with the Ingredient
					data.attributes.NutritionFacts.destroy();
					//Delete the Ingredient
					data.destroy();
				} else {
					return null;
				}
			}
		});
		
		//Delete the Ingredient from the Users Ingredient List.
		for(var u = 0; u < this.userIngredients.length; u++)
		{
			if(this.userIngredients[u] == ingredient)
			{
				this.userIngredients.splice(u, 1);
				break;
			}
		}
	}
	public getIngredientFromID(ingredientID)
	{
		for(var i = 0; i < this.ingredients.length; i++)
		{
			if(this.ingredients[i].id == ingredientID)
			{
				return this.ingredients[i];
			}
		}
		//userIngredients
		for(var i = 0; i < this.userIngredients.length; i++)
		{
			if(this.userIngredients[i].id == ingredientID)
			{
				return this.userIngredients[i];
			}
		}
	}
	public getMostRecentUserDrink()
	{
		if(this.userDrinks.length > 0)
		return this.userDrinks[this.userDrinks.length]
	}
    async drinkLikes(drinkID)
    {
        var currLikes;
        const Recipe = Parse.Object.extend('Recipe');
        let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
        await query1.first({
			success: function(drink)
            {
				if(drink)
                {
                    currLikes = drink.attributes.likes;
                    console.log(currLikes);
                }
			}
        });
        return currLikes;
    }
    async drinkDislikes(drinkID)
    {
        var currDislikes;
        const Recipe = Parse.Object.extend('Recipe');
        let query2 = new Parse.Query(Recipe);
		query2.equalTo("objectId", drinkID);
        await query2.first({
			success: function(drink)
            {
				if(drink)
                {
                    currDislikes = drink.attributes.dislikes;
                    console.log(currDislikes);
                }
			}
        });
        return currDislikes;
    }
	async likeRecipe(drinkID)
	{
		//this.dataService.likeRecipe(this.drink.id);
		//This code adds a like for the drink that is called.
		//Database Code
		var currLikes;
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		await query1.first({
			success: function(drink){
				if(drink){
					currLikes = drink.attributes.likes;
					if(currLikes)
					{
						currLikes += 1;
						drink.set('likes', currLikes);
					}
					else
					{
						drink.set('likes', 1);
					}
					drink.save(null, {
						success: function(NewDrink)
						{
							console.log("Saved");
						},
						error: function(response, error)
						{
							alert(error.code+' Failed to Save Drink ' + error.message);
						}
					});
				}
			}
		});
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser){

			var currRecipes = tempCurrentUser.attributes.recipesLiked;
			if(currRecipes)
			{
				currRecipes.push(drinkID);
				tempCurrentUser.set('recipesLiked', currRecipes);
			}
			else
			{
				var recipesLikedA = [drinkID];
				tempCurrentUser.set('recipesLiked', recipesLikedA);
			}
			tempCurrentUser.save(null,{
				success: function(NewUser)
				{
					NewUser.fetch();
					console.log("Saved");
				},
				error: function(response, error)
				{
					alert(error.code+' Failed to Save User Information ' + error.message);
				}
			});

		}
		for(var i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].id == drinkID)
			{
				this.allUserRecipes[i].likes = currLikes;
				break;
			}
		}
		for(var j = 0; j < this.userDrinks.length; j++)
		{
			if(this.userDrinks[j].id == drinkID)
			{
				this.userDrinks[j].likes = currLikes;
				break;
			}
		}
	}

	async unLikeRecipe(drinkID)
	{
		//This code takes away a dislike for the drink that is called.
		//Database Code
		var currLikes;
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		await query1.first({
			success: function(drink){
				if(drink){
					currLikes = drink.attributes.likes;
					if(currLikes)
					{
						currLikes -= 1; 
						drink.set('likes', currLikes);
					}
					else
					{
						drink.set('likes', 0);
					}
					drink.save(null, {
						success: function(NewDrink)
						{
							console.log("Saved");
						},
						error: function(response, error)
						{
							alert(error.code+' Failed to Save Drink ' + error.message);
						}
					});
				}
			}
		});
		for(var i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].id == drinkID)
			{
				this.allUserRecipes[i].likes = currLikes;
				break;
			}
		}
		for(var j = 0; j < this.userDrinks.length; j++)
		{
			if(this.userDrinks[j].id == drinkID)
			{
				this.userDrinks[j].likes = currLikes;
				break;
			}
		}
	}

	async dislikeRecipe(drinkID)
	{
		//this.dataService.dislikeRecipe(this.drink.id);
		//This code adds a dislike for the drink that is called.
		//Database Code
		var currDislikes;
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		await query1.first({
			success: function(drink){
				if(drink){
					currDislikes = drink.attributes.dislikes;
					if(currDislikes)
					{
						currDislikes += 1; 
						drink.set('dislikes', currDislikes);
					}
					else
					{
						drink.set('dislikes', 1);
					}
					drink.save(null, {
						success: function(NewDrink)
						{
							console.log("Saved");
						},
						error: function(response, error)
						{
							alert(error.code+' Failed to Save Drink ' + error.message);
						}
					});
				}
			}
		});
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser){

			var currRecipes = tempCurrentUser.attributes.recipesDisliked;
			if(currRecipes)
			{
				currRecipes.push(drinkID);
				tempCurrentUser.set('recipesDisliked', currRecipes);
			}
			else
			{
				var recipesDislikedA = [drinkID];
				tempCurrentUser.set('recipesDisliked', recipesDislikedA);
			}
			tempCurrentUser.save(null,{
				success: function(NewUser)
				{
					NewUser.fetch();
					console.log("Saved");
				},
				error: function(response, error)
				{
					alert(error.code+' Failed to Save User Information ' + error.message);
				}
			});

		}

		for(var i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].id == drinkID)
			{
				this.allUserRecipes[i].dislikes = currDislikes;
				break;
			}
		}
		for(var j = 0; j < this.userDrinks.length; j++)
		{
			if(this.userDrinks[j].id == drinkID)
			{
				this.userDrinks[j].dislikes = currDislikes;
				break;
			}
		}
	}

	async unDislikeRecipe(drinkID)
	{
		//This code takes away a dislike for the drink that is called.
		//Database Code
		var currDislikes;
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		await query1.first({
			success: function(drink){
				if(drink){
					currDislikes = drink.attributes.dislikes;
					if(currDislikes)
					{
						currDislikes -= 1; 
						drink.set('dislikes', currDislikes);
					}
					else
					{
						drink.set('dislikes', 0);
					}
					drink.save(null, {
						success: function(NewDrink)
						{
							console.log("Saved");
						},
						error: function(response, error)
						{
							alert(error.code+' Failed to Save Drink ' + error.message);
						}
					});
				}
			}
		});
		for(var i = 0; i < this.allUserRecipes.length; i++)
		{
			if(this.allUserRecipes[i].id == drinkID)
			{
				this.allUserRecipes[i].dislikes = currDislikes;
				break;
			}
		}
		for(var j = 0; j < this.userDrinks.length; j++)
		{
			if(this.userDrinks[j].id == drinkID)
			{
				this.userDrinks[j].dislikes = currDislikes;
				break;
			}
		}
	}

	public matchIDwithIngredient(IDsToMatch, drinkIngredientsAmounts ){

		var drinkIngredients = [];
		var drinkIngredientsDetails = [];

		for(var i = 0; i < IDsToMatch.length; i++)
		{
			for(var y = 0; y < this.userIngredients.length; y++)
			{
				if(this.userIngredients[y].id == IDsToMatch[i])
				{
					drinkIngredients.push(this.userIngredients[y]);
					break;
				}
			}
			for(var y = 0; y < this.ingredients.length; y++)
			{
				if(this.ingredients[y].id == IDsToMatch[i])
				{
					drinkIngredients.push(this.ingredients[y]);
					break;
				}
			}
		}
		for(var i = 0; i < drinkIngredients.length; i++)
		{
			drinkIngredientsDetails.push({item: drinkIngredients[i], amount: drinkIngredientsAmounts[i]});
		}

		return drinkIngredientsDetails;
	}

	public hasUserLikedRecipe(drinkID)
	{
		//Returns true if the user has liked the drink
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		var userHasLiked = false;
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser)
		{
			var userLikesList = tempCurrentUser.attributes.recipesLiked;
			if(userLikesList)
			{
				for(let i = 0; i < userLikesList.length; i++)
				{
					if(userLikesList[i] == drinkID)
					{
						userHasLiked = true;
						break;
					}
				}
			}
			return userHasLiked;
		}
	}
	public hasUserDislikedRecipe(drinkID)
	{
		//Returns true if user has disliked the drink
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		var userHasDisliked = false;
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser)
		{
			var userDislikesList = tempCurrentUser.attributes.recipesDisliked;
			if(userDislikesList)
			{
				for(let i = 0; i < userDislikesList.length; i++)
				{
					if(userDislikesList[i] == drinkID)
					{
						userHasDisliked = true;
						break;
					}
				}
			}
			return userHasDisliked;
		}
	}
	async removeDrinkFromLiked(drinkID)
	{
		//Removes all drinks from liked array that match drink I.D.
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser)
		{
			var userLikesList = tempCurrentUser.attributes.recipesLiked;
			if(userLikesList)
			{
				userLikesList.splice(userLikesList.indexOf(drinkID),1);
				tempCurrentUser.set('recipesLiked', userLikesList);
			}
			else
			{
				userLikesList.splice(userLikesList.indexOf(drinkID),1);
				tempCurrentUser.set('recipesLiked', userLikesList);
			}
			tempCurrentUser.save(null,{
				success: function(NewUser)
				{
					NewUser.fetch();
					console.log("Saved");
				},
				error: function(response, error)
				{
					alert(error.code+' Failed to Save User Information ' + error.message);
				}
			});
		}
	}
	async removeDrinkFromDisliked(drinkID)
	{
		//Removes all drinks from disliked array that match drink I.D.
		const Recipe = Parse.Object.extend('Recipe');
		let query1 = new Parse.Query(Recipe);
		query1.equalTo("objectId", drinkID);
		var tempCurrentUser = Parse.User.current();
		if(tempCurrentUser)
		{
			var userDislikesList = tempCurrentUser.attributes.recipesDisliked;
			if(userDislikesList)
			{
				userDislikesList.splice(userDislikesList.indexOf(drinkID),1);
				tempCurrentUser.set('recipesDisliked', userDislikesList);
			}
			else
			{
				userDislikesList.splice(userDislikesList.indexOf(drinkID),1);
				tempCurrentUser.set('recipesDisliked', userDislikesList);
			}
			tempCurrentUser.save(null,{
				success: function(NewUser)
				{
					NewUser.fetch();
					console.log("Saved");
				},
				error: function(response, error)
				{
					alert(error.code+' Failed to Save User Information ' + error.message);
				}
			});
		}
	}
	logout()
	{
		this.currentUser = null;
		this.userDrinks = [];
		this.userIngredients = [];
		this.userLikes = [];
		this.userDislikes = [];
	}
}


