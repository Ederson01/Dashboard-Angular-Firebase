import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustonMaterialModule } from '../material.module';

import { UsuariosComponent } from './usuarios.component';

//import { UsuariosRoutingModule } from './usuarios-routing.module;
import { PipesModule } from '../../pipes/pipes.module';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustonMaterialModule,
    PipesModule
    //UsuariosRoutingModule
  ],
  declarations: [
    UsuariosComponent,
    ProfileComponent
  ]
})
export class UsuariosModule { }
