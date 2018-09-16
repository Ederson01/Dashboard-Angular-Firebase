import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';

//Plugins
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule } from 'ngx-mask';
import { FileDropModule } from 'ngx-file-drop';

//Firebase
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireFunctionsModule } from 'angularfire2/functions';
import { environment } from '../environments/environment';
import { CoreModule } from './core/core.module';

//Rotas
import { AppRoutingModule } from './app-routing.module';

//Modules
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { AdminModule } from './admin/admin.module';
import { PipesModule } from './pipes/pipes.module';
import { ServicesModule } from './services/services.module';
import { CustonMaterialModule } from './admin/material.module';
import { DirectiveModule } from './directive/directive.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpModule,
    AngularFireModule.initializeApp(environment.firebase, 'firestarter'),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireFunctionsModule,
    PerfectScrollbarModule,
    NgxMaskModule.forRoot(),
    CustonMaterialModule,
    AdminModule,
    PagesModule,
    PipesModule,
    ServicesModule,
    DirectiveModule,
    CoreModule,
    AgmCoreModule.forRoot({
      apiKey: ''
    }),
    FileDropModule
  ],
  providers: [
    HttpClientModule,
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
