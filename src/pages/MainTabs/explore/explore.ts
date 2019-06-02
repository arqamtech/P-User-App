import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SellerProfilePage } from '../../HomePages/seller-profile/seller-profile';
import * as firebase from 'firebase';
import { LoginSplashPage } from '../../Auths/login-splash/login-splash';
import { LaunchNavigator } from '@ionic-native/launch-navigator';
import {
  GoogleMaps,
  MyLocation,
  GoogleMap,
} from '@ionic-native/google-maps';

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

  // sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));
  sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));
  myLoc: Array<any> = [];

  prods: Array<any> = [];

  prodsLoaded: Array<any> = [];
  map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public platform: Platform,
    private launchNavigator: LaunchNavigator,
    public toastCtrl: ToastController,
    public navParams: NavParams
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot(LoginSplashPage);
      }
    })

    this.getSellers();
  }

  getSellers() {
    this.db.list("Products").snapshotChanges().subscribe(snap => {
      let tempArray: Array<any> = [];
      this.prods = [];
      snap.forEach(snip => {
        var temp: any = snip.payload.val();
        temp.key = snip.key;
        if (temp.Status == "Verified") {
          tempArray.push(temp);
        }
      })
      this.prods = tempArray;
      this.prodsLoaded = tempArray;
    })

    // this.sellersRef.snapshotChanges().subscribe(snap => {
    //   let tempArray: Array<any> = [];
    //   snap.forEach(snp => {

    //     let temp: any = snp.payload.val();
    //     temp.StoreKey = snp.key;

    // switch (temp.Status) {
    //   case "Unverified": temp.collo = "yellowi";
    //     break;
    //   case "Verified": temp.collo = "secondary";
    //     break;
    // }
    //     if (temp.Status == "Verified") {
    //       tempArray.push(temp);
    //     }
    //   })
    //   this.sellers = tempArray;
    //   this.sellersLoaded = tempArray;
    // })

  }

  navToStore(p) {
    this.map = GoogleMaps.create('map_canvas');

    this.map.getMyLocation()
      .then((location: MyLocation) => {
        this.myLoc.push(location.latLng.lat)
        this.myLoc.push(location.latLng.lng)
      });


    firebase.database().ref("Seller Data/Sellers").child(p.StoreKey).once("value", snap => {
      let streLoc: Array<any> = [];
      streLoc.push(snap.val().Location.lat);
      streLoc.push(snap.val().Location.lng);
      // console.log(streLoc)
      this.platform.ready().then(() => {

        this.launchNavigator.navigate(streLoc, { start: this.myLoc, app: this.launchNavigator.APP.GOOGLE_MAPS })
          .then(
            success => this.presentToast('Launched navigator'),
            error => this.presentToast('Error launching navigator' + "" + error)
          );
      })

    })
  }

  initializeItems(): void {
    this.prods = this.prodsLoaded;
  }
  getItems(searchbar) {
    this.initializeItems();
    let q = searchbar;
    if (!q) {
      return;
    }
    this.prods = this.prods.filter((v) => {
      if ((v.Name) && q) {
        if (v.Name.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }


  gtDetails(s) {
    // s.StoreKey = s.key;
    // this.navCtrl.push(ProductDisplayPage, { prod: s });
    this.navCtrl.push(SellerProfilePage, { seller: s });
  }
  //Toast Function
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      position: "top",
      duration: 4000,
      showCloseButton: false,
    });
    toast.present();
  }

}
