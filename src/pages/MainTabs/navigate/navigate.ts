import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  MyLocation,
  MarkerIcon,
  HtmlInfoWindow,
} from '@ionic-native/google-maps';
import { AngularFireDatabase } from 'angularfire2/database';
import { SellerProfilePage } from '../../HomePages/seller-profile/seller-profile';
import { LoginSplashPage } from '../../Auths/login-splash/login-splash';
declare var google: any
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})
export class NavigatePage {


  sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));
  sellers: Array<any> = [];

  sellersLoaded: Array<any> = [];
  disSearch: boolean = false;
  map: GoogleMap;
  gvk: any = { "lat": 17.4195773, "lng": 78.448375 };
  home: any = { "lat": 17.3512655, "lng": 78.5045693 };
  inox: any = { "lat": 17.3906644, "lng": 78.4884251 };


  exploreNavS = this.navParams.get("expSeller");


  myLoc: any;
  constructor(
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public db: AngularFireDatabase,
  ) {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.navCtrl.setRoot(LoginSplashPage);
      }
    })

    this.getUsers();
  }

  getUsers() {
    this.sellersRef.snapshotChanges().subscribe(snap => {
      let tempArray: Array<any> = [];
      snap.forEach(snp => {
        let temp: any = snp.payload.val();
        temp.key = snp.key;
        if (temp.Status == "Verified") {
          if (temp.FeaturedProduct) {
            firebase.database().ref("Products").child(temp.FeaturedProduct).once("value", snap => {
              temp.disImage = snap.val().ImageUrl;
            })
          } else {
            temp.disImage = temp.Banner;
          }


          tempArray.push(temp);
        }
        this.createMarkers(temp.StoreName, null, temp.Location, temp.disImage, temp.key)

      })

      this.sellers = tempArray;
      this.sellersLoaded = tempArray;
    })
  }

  initializeItems(): void {
    this.sellers = this.sellersLoaded;
  }
  getItems(searchbar) {
    this.initializeItems();
    let q = searchbar;
    if (!q) {
      this.disSearch = false;
      return;
    }
    this.disSearch = true;
    this.sellers = this.sellers.filter((v) => {
      if ((v.StoreName) && q) {
        if (v.StoreName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }


  // showStores() {
  //   this.sellers.forEach(seller => {
  //     this.createMarkers(seller.StoreName, null, seller.Location, seller.Banner, seller.key)
  //   })
  // }

  selectS(s) {
    this.map.animateCamera({
      target: s.Location,
      zoom: 15,
    })
  }


  ionViewDidLoad() {
    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
    this.map.clear();
    this.setLocation();
  }

  setLocation() {
    this.map.clear();
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        // console.log(JSON.stringify(location.latLng));
        // this.navToLoaction("My Location", "", location.latLng)

        this.map.animateCamera({
          target: location.latLng,
          zoom: 20,
        })

      })

  }








  gtGVK() {
    this.navToLoaction("GVK", "Awsum GVK", this.gvk)
  }
  gtHome() {
    this.navToLoaction("Home", "Sweet Home", this.home)
  }
  gtInox() {
    this.navToLoaction("Inox", "some Inox", this.inox)
  }

  clear() {
    this.map.clear();
  }

  // onButtonClick() {
  //   this.map.clear();

  //   // Get the location of you
  //   this.map.getMyLocation()
  //     .then((location: MyLocation) => {
  //       console.log(JSON.stringify(location.latLng));

  //       // Move the map camera to the location with animation
  //       this.map.animateCamera({
  //         target: location.latLng,
  //         zoom: 20,
  //         tilt: 0
  //       }).then(() => {
  //         // add a marker
  //         let marker: Marker = this.map.addMarkerSync({
  //           title: '@ionic-native/google-maps plugin!',
  //           snippet: 'This plugin is awesome!',
  //           position: location.latLng,
  //           animation: GoogleMapsAnimation.BOUNCE
  //         });

  //         // show the infoWindow
  //         marker.showInfoWindow();

  //         // If clicked it, display the alert
  //         marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
  //           this.showToast('clicked!');
  //         });
  //       });
  //     });
  // }


  displayStore(id) {
    this.getItems("");
    let seller = this.sellers.find(snap => {
      return snap.key == id
    })
    seller.StoreKey = seller.key;
    this.navCtrl.push(SellerProfilePage, { seller: seller })
  }





  createMarkers(title, subTit, loc, image, id) {

    // let title = marker.get("title");
    // let id = marker.get("id");
    // let banner = marker.get("banner");
    // let htmlInfoWindow = new HtmlInfoWindow();
    // let frame: HTMLElement = document.createElement('div');
    // let titleString = '<p class="popTitle">' + title + '</h3> <br>';
    // let imageString = '<img class="bannerImg" src=' + image + "/>"
    // frame.innerHTML = [
    //   imageString,
    //   titleString,
    //   '<button class="popBtn" >View</button>'
    // ].join("");
    // frame.getElementsByTagName("button")[0].addEventListener("click", () => {
    //   this.displayStore(id);
    // });
    // htmlInfoWindow.setContent(frame, {
    //   width: "160px",
    //   height: "220px",
    //   margin: 0,
    //   padding: 0,
    // });


    // let mark = this.map.addMarker({
    //   title: title,
    //   snippet: subTit,
    //   position: loc,
    //   banner: image,
    //   id: id,
    // }).then(marker => {
    //   marker.on(GoogleMapsEvent.MARKER_CLICK)
    //     .subscribe(() => {
    //       marker.hideInfoWindow();
    //       htmlInfoWindow.open(marker);
    //     });
    // });




    let icin: MarkerIcon = {
      url: image,
      size: {
        width: 100,
        height: 100,
      }
    };

    this.map.addMarker({
      title: title,
      snippet: subTit,
      position: loc,
      icon: icin,
      id: id,
    }).then(marker => {
      marker.on(GoogleMapsEvent.MARKER_CLICK)
        .subscribe(() => {
          let title = marker.get("title");
          let id = marker.get("id");
          // let banner = marker.get("banner");
          let htmlInfoWindow = new HtmlInfoWindow();
          let frame: HTMLElement = document.createElement('div');
          let titleString = '<p class="popTitle">' + title + '</h3> <br>';
          let imageString = '<img class="bannerImg" src=' + image + "/>"
          frame.innerHTML = [
            imageString,
            titleString,
            '<button class="popBtn" >View</button>'
          ].join("");
          frame.getElementsByTagName("button")[0].addEventListener("click", () => {

            this.displayStore(id);
          });
          htmlInfoWindow.setContent(frame, {
            width: "100px",
            height: "200px",
            margin: 0,
            padding: 0,
          });

          marker.hideInfoWindow();
          htmlInfoWindow.open(marker);
        });
    });



  }





  navToLoaction(title, subTit, loc) {


    let icin: MarkerIcon = {
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm_UX1isSoP4M2MQQlAn06UN8BTVPgCEvfYqqz7jZKqG7U9P_zmg',
      size: {
        width: 100,
        height: 100
      }
    };

    this.map.animateCamera({
      target: loc,
      zoom: 30,


    }).then(() => {
      let marker: Marker = this.map.addMarkerSync({
        title: title,
        snippet: subTit,
        position: loc,
        icon: icin,
        // animation: GoogleMapsAnimation.BOUNCE
      });
      marker.showInfoWindow();
    });

  }


  showToast(message: string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'middle'
    });

    toast.present(toast);
  }



  mapStyle = [
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "saturation": 100
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative.neighborhood",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]





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

    styles: this.mapStyle,
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
