import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { FileDropModule } from 'ngx-file-drop';
import { CustonMaterialModule } from '../material.module';

import { MenuComponent } from './menu/menu.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { DialogNotifyComponent } from './dialog-notify/dialog-notify.component';
import { EditImageComponent } from './edit-image/edit-image.component';
import { SelectImageComponent } from './select-image/select-image.component';

@NgModule({
  declarations: [
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    NotificationMessageComponent,
    DialogNotifyComponent,
    EditImageComponent,
    SelectImageComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    PerfectScrollbarModule,
    CustonMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    FileDropModule
  ],
  exports: [
    MenuComponent,
    HeaderComponent,
    FooterComponent,
    NotificationMessageComponent,
    DialogNotifyComponent,
    EditImageComponent,
    SelectImageComponent
  ],
  providers: [],
  entryComponents: [ DialogNotifyComponent, EditImageComponent, SelectImageComponent ]
})
export class ComponentsModule { }
