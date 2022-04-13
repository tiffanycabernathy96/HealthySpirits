import 'reflect-metadata';
import { MockNutritionValuesProvider } from '../mocks/mock.nutritionvalues';
import 'jest';

/**
 * Block level variable for assigning the Mock DatesProvider service to
 *
 */
let nutritionVals 				= null;



/**
 * Re-create the MockNutritionValuesProvider class object before each
 * unit test is run
 *
 */
beforeEach(() => {
   nutritionVals         = new MockNutritionValuesProvider();

});



/**
 * Group the unit tests for the MockNutritionValuesProvider into one
 * test suite
 *
 */
describe('Nutrition Values service', () =>
{
	/**
	* Test that the returned value matches expected values
	* calories, cal from fat, totalfat, satfar, transfat, cholesterol, 
	* sodium, totalcarb, diet fiber, sugars, protein, vita, vitc, iron, calcium
	* alcohol per serving
	*/
	test('Returns the 8 oz values', () =>
	{
		let updatedValues   = nutritionVals.determineEightOunceValues(nutritionVals._BORDEN1OZ),
		expected            = [150, 70, 8, 5, 0, 35, 125, 12, 0, 12, 8, 6, 4, 0, 30, 0];

		expect(updatedValues).toHaveLength(16);
		expect(updatedValues).toEqual(expect.arrayContaining(expected));
	});
	
	/**
	* Test that the returned value matches expected values
	* calories, cal from fat, totalfat, satfar, transfat, cholesterol, 
	* sodium, totalcarb, diet fiber, sugars, protein, vita, vitc, iron, calcium
	* alcohol per serving
	*/
	test('Returns the Recipe Nutritional Values', () =>
	{
		let nutValues 		= nutritionVals.determineRecipesNutValues([nutritionVals._BORDEN1OZ, nutritionVals._KAHULA1OZ, nutritionVals._BACARDI1OZ]),
		expected 			= [7, 460.750, 8.750, 1.000, .625, 0.000, 4.375, 21.625, 30.900, 0.000, 30.900, 1.000, .750, .500, 0.000, 3.750, 46.400];

		expect(nutValues).toHaveLength(17);
		expect(nutValues).toEqual(expect.arrayContaining(expected));
	});
});