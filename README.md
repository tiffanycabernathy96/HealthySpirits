# HealthySpirits

## NOTE: I brought this repository into my Github so I could reference it on my resume. The original repository is private. 

## Requirements to Build:

Node.js

JDK 1.8 & Higher

Android SDK

Ionic & Cordova

### Installing JDK & Android Studio

Simply install the JDK from this link:

https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html 

Of course, pick the one appropriate for your system and follow the default instalation procedure, making sure to reboot.

### Installing Android SDK

Simply install Android Studio from this link:

https://developer.android.com/studio/

Follow default installation, making sure to reboot.

### Installing Node.js

Simply install node.js from the link below, for your system:

https://nodejs.org/en/download/

Follow default install procedure, restarting afterwards.

### Installing Ionic & Cordova

Open the Terminal/Command Line of your system and type

npm install -g ionic cordova


## After Installation
Now that all of the requirements are setup:

Clone the repository to a local location

cd to that local folder

ionic serve

It should automaticlly open your default browser to the app.

### Build the APK

cd to the local folder

ionic cordova build --debug android

It will list where it output the apk, simply install on any android devices above Kit Kat.

## Testing
### First: Go to the Root Directory and type "npm install" to make sure you have all the dependencies installed that are newly added to the package.json file. 
### Note: For Mac users make sure to type "sudo -s" before all npm commands
### Running the Unit Tests

#### Steps:
##### Running The Test

Open your command prompt/terminal and navigate to where the code is for this project. 

Type "npm test" and press enter. 

You Should see something similar to the following: 

 PASS  src/unit-tests/nutritionvalues.test.ts
 
  Nutrition Values service
  
    √ Returns the 8 oz values
    
    √ Returns the Recipe Nutritional Values

Test Suites: 1 passed, 1 total

Tests:       2 passed, 2 total

#### Test Files Location
Within the unit-tests folder 
HealthySpirits/src/unit-tests/nutritionvalues.test.ts

### Running the Behavior Tests

#### Steps:
##### Installing Protractor:
Open your command prompt/terminal and navigate to where the code is for this project. 

Type in: 

npm install protractor --save-dev

npm install -g protractor

webdriver-manager update

##### Running The Test
Open your command prompt/terminal and navigate to where the code is for this project. 

Type "protractor" and press enter. 

You Should see something similar to the following: 

Jasmine started

  Behavior Tests
  
    √ The Start Page is Displayed on Open
    
    √ The User Can Log In

Executed 2 of 2 specs SUCCESS in 6 secs.

#### Test Files Location
Within the e2e folder 
HealthySpirits/e2e/test-e2e-spec.ts
