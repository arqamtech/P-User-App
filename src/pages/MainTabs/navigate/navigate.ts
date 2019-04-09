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
  Environment,
  MyLocation,
  GoogleMapsAnimation
} from '@ionic-native/google-maps';


@IonicPage()
@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})
export class NavigatePage {


  map: GoogleMap;

  constructor(public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {
    // Environment.setEnv({
    //   'API_KEY_FOR_BROWSER_RELEASE': '(your api key for `https://`)',
    //   'API_KEY_FOR_BROWSER_DEBUG': '(your api key for `http://`)'
    // });

    // Create a map after the view is loaded.
    // (platform is already ready in app.component.ts)
    this.map = GoogleMaps.create('map_canvas', {
      camera: {
        target: {
          lat: 17.4187076,
          lng: 78.4362371
        },
        zoom: 18,
        tilt: 30
      }
    });

  }

  onButtonClick() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location.latLng));













        // // Move the map camera to the location with animation
        // this.map.animateCamera({
        //   target: location.latLng,
        //   zoom: 30,
        //   tilt: 0
        // }).then(() => {
        //     // add a marker
        //     let marker: Marker = this.map.addMarkerSync({
        //       title: '@ionic-native/google-maps plugin!',
        //       snippet: 'This plugin is awesome!',
        //       position: location.latLng,
        //       animation: GoogleMapsAnimation.BOUNCE
        //     });

        //     // show the infoWindow
        //     marker.showInfoWindow();

        //     // If clicked it, display the alert
        //     marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
        //       this.showToast('clicked!');
        //     });
        //   });
      });
  }

  addMarker() {
    let marker: Marker = this.map.addMarkerSync({
      title: 'Ionic',
      icon: 'blue',
      animation: 'DROP',
      position: {
        lat: 17.4030548,
        lng: 78.4201877
      }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
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
}
