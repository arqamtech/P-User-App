import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { SellerProfilePage } from '../../HomePages/seller-profile/seller-profile';


@IonicPage()
@Component({
  selector: 'page-explore',
  templateUrl: 'explore.html',
})
export class ExplorePage {

  sellersRef = this.db.list('Seller Data/Sellers', ref => ref.orderByChild("TimeStamp"));

  sellers: Array<any> = [];
  sellersLoaded: Array<any> = [];

  constructor(
    public navCtrl: NavController,
    public db: AngularFireDatabase,
    public navParams: NavParams
  ) {
    this.getSellers();
  }

  getSellers() {
    this.sellersRef.snapshotChanges().subscribe(snap => {
      let tempArray: Array<any> = [];
      snap.forEach(snp => {

        let temp: any = snp.payload.val();
        temp.key = snp.key;
        if (temp.Status == "Verified") {
          tempArray.push(temp);
        }
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
      return;
    }
    this.sellers = this.sellers.filter((v) => {
      if ((v.StoreName) && q) {
        if (v.StoreName.toLowerCase().indexOf(q.toLowerCase()) > -1) {
          return true;
        }
        return false;
      }
    });
  }


  gtDetails(s) {
    s.StoreKey = s.key;
    this.navCtrl.push(SellerProfilePage, { seller: s });
  }

}
