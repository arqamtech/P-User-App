import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
import { SellerProfilePage } from '../../HomePages/seller-profile/seller-profile';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-nav-to-single-store',
  templateUrl: 'nav-to-single-store.html',
})
export class NavToSingleStorePage {

  store = this.navParams.get("expSeller");

  map: GoogleMap;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    console.log(this.store)
  }

  ionViewDidLoad() {
    if (this.store.FeaturedProduct) {
      firebase.database().ref("Products").child(this.store.FeaturedProduct).once("value", snap => {
        this.store.disImage = snap.val().ImageUrl;
      })
    } else {
      this.store.disImage = this.store.Banner;
    }
    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
    this.map.clear();
    this.createMarkers(this.store.StoreName, null, this.store.Location, this.store.disImage, this.store.key)
  }

  createMarkers(title, subTit, loc, image, id) {

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
    }).then(() => {
      this.map.animateCamera({
        target: loc,
        zoom: 20,
      })
    });



  }





  displayStore(id) {
    this.navCtrl.push(SellerProfilePage, { seller: this.store })
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
