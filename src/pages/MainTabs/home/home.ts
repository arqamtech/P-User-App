import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import { CategoryWiseProductsPage } from '../../HomePages/category-wise-products/category-wise-products';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  bannersRef = this.db.list('Promotionals/Banners', ref=>ref.orderByChild("TimeStamp"));
  catRef = this.db.list('Categories');

  banners : Array<any>=[];  
  cats : Array<any>=[];  

  constructor(
  public navCtrl: NavController, 
  public db : AngularFireDatabase,
  public navParams: NavParams,
  ) {
    this.getBanners();
    this.getCats();
  }

  getBanners(){
    this.bannersRef.snapshotChanges().subscribe(snap=>{
      this.banners = [];
      snap.forEach(snp=>{
        let temp : any = snp.payload.val();
        temp.key = snp.key;
        this.banners.push(temp)
      })
    })
  }
  getCats(){
    this.catRef.snapshotChanges().subscribe(snap=>{
      this.cats = [];
      snap.forEach(snp=>{
        let temp : any = snp.payload.val();
        temp.key = snp.key;
        this.cats.push(temp)
      })
    })
  }
  showProducts(c){
    this.navCtrl.push(CategoryWiseProductsPage,{cat : c})
  }
}
