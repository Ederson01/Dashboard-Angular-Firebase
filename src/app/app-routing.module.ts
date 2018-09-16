import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';

//Pages
import { LoginComponent } from './admin/login/login.component';
import { HomeComponent } from './pages/home/home.component';

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },{
    path: '',
    component: HomeComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
