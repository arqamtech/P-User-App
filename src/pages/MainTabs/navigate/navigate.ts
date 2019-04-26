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
  GoogleMapsAnimation,
  Polygon,
  ILatLng,
  PolygonOptions,
  GroundOverlay,
  LatLngBounds,

} from '@ionic-native/google-maps';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-navigate',
  templateUrl: 'navigate.html',
})
export class NavigatePage {


  sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));
  sellers: Array<any> = [];


  map: GoogleMap;
  gvk: any = { "lat": 17.4195773, "lng": 78.448375 };
  home: any = { "lat": 17.3512655, "lng": 78.5045693 };
  inox: any = { "lat": 17.3906644, "lng": 78.4884251 };


  myLoc: any;
  constructor(
    public toastCtrl: ToastController,
    public db: AngularFireDatabase,
  ) {

  }

  getUsers() {
    this.sellersRef.snapshotChanges().subscribe(snap => {
      let tempArray: Array<any> = [];
      snap.forEach(snp => {

        let temp: any = snp.payload.val();
        temp.key = snp.key;
        switch (temp.Status) {
          case "Unverified": temp.collo = "yellowi";
            break;
          case "Verified": temp.collo = "secondary";
            break;
        }
        tempArray.push(temp);
      })
      this.sellers = tempArray;
    })

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
      'myLocation': true,   // (blue dot)
      'indoorPicker': true,
      'zoom': true,          // android only
      'mapToolbar': true     // android only
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


  GORYOKAKU_POINTS: ILatLng[] = [
    this.gvk, this.home, this.inox
    // { lat: 41.79883, lng: 140.75675 },
    // { lat: 41.799240000000005, lng: 140.75875000000002 },
    // { lat: 41.797650000000004, lng: 140.75905 },
    // { lat: 41.79637, lng: 140.76018000000002 },
    // { lat: 41.79567, lng: 140.75845 },
    // { lat: 41.794470000000004, lng: 140.75714000000002 },
    // { lat: 41.795010000000005, lng: 140.75611 },
    // { lat: 41.79477000000001, lng: 140.75484 },
    // { lat: 41.79576, lng: 140.75475 },
    // { lat: 41.796150000000004, lng: 140.75364000000002 },
    // { lat: 41.79744, lng: 140.75454000000002 },
    // { lat: 41.79909000000001, lng: 140.75465 }
  ];
  options: PolygonOptions = {
    'points': this.GORYOKAKU_POINTS,
    'strokeColor': '#AA00FF',
    'fillColor': '#00FFAA',
    'strokeWidth': 10
  };
  overlays: GroundOverlay[];


  drawGVk() {
    this.map.addPolygon(this.options).then((polygon: Polygon) => {
    });
  }

  createOverlay() {
    let latLngBounds: LatLngBounds = new LatLngBounds();

    let regions: any[] = [
      {
        "bounds": [
          this.inox
          // { "lat": 41.144877, "lng": 138.066162 },
          // { "lat": 45.738532, "lng": 147.092896 }
        ],
        "url": "https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
      },
      // {
      //   "bounds": [
      //     { "lat": 43.252673, "lng": 144.749877 },
      //     { "lat": 45.698391, "lng": 149.554238 }
      //   ],
      //   "url": "https://images.pexels.com/photos/1308881/pexels-photo-1308881.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
      // },
      // {
      //   "bounds": [
      //     { "lat": 41.640700, "lng": 142.146678 },
      //     { "lat": 40.113827, "lng": 139.386590 }
      //   ],
      //   "url": "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
      // }
    ];
    this.overlays = regions.map((region: any, idx: number) => {
      latLngBounds.extend(region.bounds[0]);
      latLngBounds.extend(region.bounds[1]);

      // Add ground overlay
      let groundOverlay: GroundOverlay = this.map.addGroundOverlaySync({
        'url': region.url,
        'bounds': region.bounds,
        'opacity': 0.5,
        'zIndex': idx,
        'clickable': true
      });
      groundOverlay.on(GoogleMapsEvent.GROUND_OVERLAY_CLICK).subscribe(
        // this.onClick.bind(this)
      );
      return groundOverlay;
    });

    // Move camera to contains all ground overlays
    this.map.moveCamera({
      target: latLngBounds
    });
  }


  // onClick(params: any[]) {
  //   // let latLng: LatLng = params[0];
  //   let clickedOverlay: GroundOverlay = params[1];

  //   this.overlays.forEach((groundOverlay: GroundOverlay, idx: number) => {
  //     if (clickedOverlay.getHashCode() === groundOverlay.getHashCode()) {
  //       groundOverlay.setZIndex(1);
  //       groundOverlay.setOpacity(1);
  //     } else {
  //       groundOverlay.setZIndex(0);
  //       groundOverlay.setOpacity(0.5);
  //     }
  //   });
  // }



  ionViewDidLoad() {
    this.map = GoogleMaps.create('map_canvas', this.mapOptions);
  }



  addGVk() {
    this.navToLoaction("GVK", "AwsumGVk", this.gvk)
  }
  gtHome() {
    this.navToLoaction("Home", "Sweet Home", this.home)
  }

  clear() {
    this.map.clear();
  }

  onButtonClick() {
    this.map.clear();

    // Get the location of you
    this.map.getMyLocation()
      .then((location: MyLocation) => {
        console.log(JSON.stringify(location.latLng));

        // Move the map camera to the location with animation
        this.map.animateCamera({
          target: location.latLng,
          zoom: 20,
          tilt: 0
        }).then(() => {
          // add a marker
          let marker: Marker = this.map.addMarkerSync({
            title: '@ionic-native/google-maps plugin!',
            snippet: 'This plugin is awesome!',
            position: location.latLng,
            animation: GoogleMapsAnimation.BOUNCE
          });

          // show the infoWindow
          marker.showInfoWindow();

          // If clicked it, display the alert
          marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
            this.showToast('clicked!');
          });
        });
      });
  }


  navToLoaction(title, subTit, loc) {
    this.map.animateCamera({
      target: loc,
      zoom: 20,
      tilt: 0
    }).then(() => {
      // add a marker
      let marker: Marker = this.map.addMarkerSync({
        title: title,
        snippet: subTit,
        position: loc,
        animation: GoogleMapsAnimation.BOUNCE
      });
      marker.showInfoWindow();
    });

  }

  getVisible() {
    console.log(this.map.getVisibleRegion());

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
