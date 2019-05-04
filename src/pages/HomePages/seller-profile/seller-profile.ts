import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as firebase from 'firebase';
import { ProductDisplayPage } from '../product-display/product-display';
import { AngularFireDatabase } from 'angularfire2/database';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment,
  MyLocation,
  GoogleMapsAnimation,
  Polygon,
  ILatLng,
  PolygonOptions,
  GroundOverlay,
  LatLngBounds,
  LatLng,
  CircleOptions,
  Circle,
  MarkerIcon,

} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-seller-profile',
  templateUrl: 'seller-profile.html',
})
export class SellerProfilePage {

  seller = this.navParams.get("seller")

  banner: string;
  products: Array<any> = [];
  locaArray: Array<any> = [];
  myLoc: Array<any> = [];

  map: GoogleMap;

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams,
    public platform: Platform,
    private launchNavigator: LaunchNavigator,
  ) {
    this.getSeller();
    this.getProds();
  }

  ionViewDidLoad() {
    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        this.myLoc.push(location.latLng.lat)
        this.myLoc.push(location.latLng.lng)
      });
  }
  getSeller() {
    firebase.database().ref("Seller Data/Sellers").child(this.seller.StoreKey).once("value", itemSnap => {
      let temp: any = itemSnap.val();
      this.banner = temp.Banner;
      this.locaArray.push(temp.Location.lat);
      this.locaArray.push(temp.Location.lng);
    })
  }

  getProds() {
    this.db.list(`Seller Data/Products/${this.seller.StoreKey}`).snapshotChanges().subscribe(snap => {
      this.products = [];
      snap.forEach(snp => {
        this.db.object(`Products/${snp.key}`).snapshotChanges().subscribe(pSnap => {
          var temp: any = pSnap.payload.val();
          temp.key = pSnap.key;
          if (temp.Status == "Verified") {
            this.products.push(temp);
          }
        })
      })
    })




    // firebase.database().ref("Seller Data").child("Products").child(this.seller.StoreKey).once("value", itemSnap => {
    //   itemSnap.forEach(snap => {
    //     firebase.database().ref("Products").child(snap.key).once("value", iisnap => {
    //       let temp: any = iisnap.val();
    //       temp.key = iisnap.key;
    //       if (temp.Status == "Verified") {
    //         this.products.push(temp)
    //       }


    //     })
    //   })
    // })
  }
  displyProd(p) {
    this.navCtrl.push(ProductDisplayPage, { prod: p })
  }





  navigate() {
    this.platform.ready().then(() => {

      this.launchNavigator.navigate(this.locaArray, { start: this.myLoc, app: this.launchNavigator.APP.GOOGLE_MAPS })
        .then(
          success => console.log('Launched navigator'),
          error => console.log('Error launching navigator', error)
        );
    })
  }
  mapOptions: GoogleMapOptions = {
    controls: {
      'compass': true,
      'myLocationButton': true,
      'myLocation': true,
      'indoorPicker': true,
      // 'zoom': true,          
      // 'mapToolbar': true     
    },

    gestures: {
      scroll: true,
      tilt: true,
      zoom: true,
      rotate: true
    },

    camera: {
      target: [
        { lat: 17.4187076, lng: 78.4362371 }
      ]

    },
    tilt: 90,
    preferences: {
      zoom: {
        // minZoom: 5,
        // maxZoom: 25
      },

      padding: {
        left: 10,
        top: 10,
        bottom: 10,
        right: 10
      },

      building: true
    }
  };
}
