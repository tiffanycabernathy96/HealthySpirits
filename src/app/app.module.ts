import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { Camera } from '@ionic-native/camera';
import { HomePage } from '../pages/home/home';
import { RecipesPage } from '../pages/recipes/recipes';
import { EditRecipePage } from '../pages/editRecipe/editRecipe';
import { ProfilePage } from '../pages/profile/profile';
import { TabsPage } from '../pages/tabs/tabs';
import { Data } from '../providers/data';
import { SigninPage } from '../pages/signin/signin';
import { SignupPage } from '../pages/signup/signup';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Network } from '@ionic-native/network';
import { HttpClient, HttpClientModule } from '@angular/common/http'
import { AgmCoreModule } from '@agm/core';
import { Facebook } from '@ionic-native/facebook'
import {StartPage} from "../pages/start/start";
import { EditProfilePage } from '../pages/editProfile/editProfile';
import { DrinkDetailPage } from '../pages/drinkDetail/drinkDetail';
import {AddSpiritPage} from "../pages/addSpirit/addSpirit";
import {FilterComponent} from "../components/filter/filter";
import {AddAmountComponent} from "../components/add-amount/add-amount";
import {ColorGuidePopoverComponent} from "../components/color-guide-popover/color-guide-popover";
import {IngredientsListPopoverComponent} from "../components/ingredients-list-popover/ingredients-list-popover";
import {AddNewIngredientPage} from "../pages/addNewIngredient/addNewIngredient";
import {EditUserIngredientPage} from "../pages/editUserIngredient/editUserIngredient";
import {Clipboard} from '@ionic-native/clipboard';
import { ToastController} from "ionic-angular";
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [
	MyApp,
	HomePage,
	TabsPage,
	SigninPage,
	SignupPage,
	RecipesPage,
	ProfilePage,
  StartPage,
	EditRecipePage,
	ProfilePage,
	EditProfilePage,
	DrinkDetailPage,
  AddNewIngredientPage,
  EditUserIngredientPage,
    AddSpiritPage,
    FilterComponent,
    AddAmountComponent,
    ColorGuidePopoverComponent,
    IngredientsListPopoverComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAFYM38buX_qRA6yBpt2XXPAhM-APCvqCY'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
	MyApp,
	HomePage,
	TabsPage,
	SigninPage,
	SignupPage,
	RecipesPage,
	ProfilePage,
  StartPage,
	EditRecipePage,
	ProfilePage,
	EditProfilePage,
	DrinkDetailPage,
  AddNewIngredientPage,
  EditUserIngredientPage,
    AddSpiritPage,
    FilterComponent,
    AddAmountComponent,
    ColorGuidePopoverComponent,
    IngredientsListPopoverComponent
  ],
  providers: [
	StatusBar,
	SplashScreen,
	Data,
	Camera,
	Network,
	HttpClientModule,
	Facebook,
    ToastController,
    Clipboard,
    SocialSharing,
	{provide: ErrorHandler, useClass: IonicErrorHandler},
  ]
})
export class AppModule {}
