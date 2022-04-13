import { Injectable } from '@angular/core';


@Injectable()
export class MockNutritionValuesProvider
{
	public _BORDEN1OZ : any =  [1, 18.75, 8.75, 1, .625, 0, 4.375, 15.625, 1.5, 0, 1.5, 1, .75, .5, 0, 3.75, 0 ];
	public _KAHULA1OZ : any =  [2, 91, 0, 0, 0, 0, 0, 3, 14.7, 0, 14.7, 0, 0, 0, 0, 0, 4.6 ];
	public _BACARDI1OZ : any =  [4, 65, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 9.3 ];
	 
	constructor()
	{}

	/**
    *
    * Determine 8oz Values from 1oz Values for nutrition information
    *
    * @method determineEightOunceValues
    * @return {String}
    *
    */
	determineEightOunceValues(values: number[]) : number[]
	{
		let returnVals = [];

		for (var i = 1; i < values.length; i++){
			returnVals[i-1] = values[i-1] * 8;
		}
		return returnVals;
	}
	determineRecipesNutValues(ingredients: any[]) : number[]
	{
		let recipeNutVals = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
		//Size of Drink i.e. 8oz drink etc. For this example 7oz
		let sum = 0;
		for(var i = 0; i < ingredients.length; i++)
		{
			sum = +ingredients[i][0] + +sum;
		}
		recipeNutVals[0] = sum;
		
		for(var i = 0; i < ingredients.length; i++)
		{
			var ingredient = ingredients[i];
			var amount : number = ingredient[0];
			/*
			* calories, cal from fat, totalfat, satfar, transfat, cholesterol, 
			* sodium, totalcarb, diet fiber, sugars, protein, vita, vitc, iron, calcium
			* alcohol per serving
			*/
			recipeNutVals[1] += ingredient[1]*amount;
			recipeNutVals[2] += ingredient[2]*amount;
			recipeNutVals[3] += ingredient[3]*amount;
			recipeNutVals[4] += ingredient[4]*amount;
			recipeNutVals[5] += ingredient[5]*amount;
			recipeNutVals[6] += ingredient[6]*amount;
			recipeNutVals[7] += ingredient[7]*amount;
			recipeNutVals[8] += ingredient[8]*amount;
			recipeNutVals[9] += ingredient[9]*amount;
			recipeNutVals[10] += ingredient[10]*amount;
			recipeNutVals[11] += ingredient[11]*amount;
			recipeNutVals[12] += ingredient[12]*amount;
			recipeNutVals[13] += ingredient[13]*amount;
			recipeNutVals[14] += ingredient[14]*amount;
			recipeNutVals[15] += ingredient[15]*amount;
			recipeNutVals[16] += ingredient[16]*amount;
		}
		for(var i = 1; i < recipeNutVals.length; i++)
		{
			recipeNutVals[i] = +recipeNutVals[i].toFixed(3);
		}
		return recipeNutVals;
	}
}