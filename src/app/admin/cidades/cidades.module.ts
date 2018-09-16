import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustonMaterialModule } from '../material.module';

import { CidadesComponent } from './cidades.component';
import { CidadesFormComponent } from './cidades-form/cidades-form.component';

//import { CidadesRoutingModule } from './cidades-routing.module;
import { PipesModule } from '../../pipes/pipes.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustonMaterialModule,
    PipesModule
    //CidadesRoutingModule
  ],
  declarations: [
    CidadesComponent,
    CidadesFormComponent
  ]
})
export class CidadesModule { }
