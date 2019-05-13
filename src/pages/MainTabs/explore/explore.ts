import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SellerProfilePage } from '../../HomePages/seller-profile/seller-profile';
import * as firebase from 'firebase';
import { ProductDisplayPage } from '../../HomePages/product-display/product-display';

@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

  // sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));

  prods: Array<any> = [];

  prodsLoaded: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
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
        console.log(temp);

      })
      this.prods = tempArray;
      this.prodsLoaded = tempArray;
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
    this.navCtrl.push(ProductDisplayPage, { prod: s });
  }

}
