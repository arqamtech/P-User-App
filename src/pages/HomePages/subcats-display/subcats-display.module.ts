import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SubcatsDisplayPage } from './subcats-display';

@NgModule({
  declarations: [
    SubcatsDisplayPage,
  ],
  imports: [
    IonicPageModule.forChild(SubcatsDisplayPage),
  ],
})
export class SubcatsDisplayPageModule {}
