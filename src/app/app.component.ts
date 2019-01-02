import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TabsPage } from '../pages/Supp/tabs/tabs';
import { LoginSplashPage } from '../pages/Auths/login-splash/login-splash';
import * as firebase from 'firebase';
import { SignUpPage } from '../pages/Auths/sign-up/sign-up';
import { AngularFireDatabase } from 'angularfire2/database';
import { LoaderPage } from '../pages/Supp/loader/loader';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoaderPage;

  constructor(
  public platform: Platform, 
  public statusBar: StatusBar, 
  public db : AngularFireDatabase,
  public splashScreen: SplashScreen
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      
      firebase.auth().onAuthStateChanged((user)=>{
        if(user){
          this.db.object(`User Data/Users/${user.uid}`).snapshotChanges().subscribe(snap=>{
            if(snap.payload.exists()){
              this.rootPage = TabsPage;
            }else{
              this.rootPage = SignUpPage;
            } 
          })
        }else{
          this.rootPage = LoginSplashPage;
        }
      })

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  
  }

}
