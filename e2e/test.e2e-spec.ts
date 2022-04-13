import { browser, element, by, ElementFinder } from 'protractor';

describe('Behavior Tests', () => {

	beforeEach(() => {
		browser.get('');
	});

	it('The Start Page is Displayed on Open', () => {
		expect(element(by.className('login')));
	});
	
	it('The User Can Log In', () => {
		var loginButton = element(by.className('login'));
		loginButton.click().then(() => { 

			// Wait for the page transition
			browser.driver.sleep(1000);

			element(by.css('input[type=text]') ).sendKeys('test');
			element(by.css('input[type=password]') ).sendKeys('test');

			var signinButton = element(by.className('signin'));
			signinButton.click().then(() => {
				// Wait for the page transition
				browser.driver.sleep(1000);
				
				expect(element(by.css('[aria-selected=true] .tab-button-text')) // Grab the title of the selected tab
				.getAttribute('innerHTML')) // Get the text content
			    .toContain('Home'); // Check if it contains the text "Home"
			});

		});
	});

  });