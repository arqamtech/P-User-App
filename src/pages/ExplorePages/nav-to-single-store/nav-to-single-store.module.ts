import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NavToSingleStorePage } from './nav-to-single-store';

@NgModule({
  declarations: [
    NavToSingleStorePage,
  ],
  imports: [
    IonicPageModule.forChild(NavToSingleStorePage),
  ],
})
export class NavToSingleStorePageModule {}
