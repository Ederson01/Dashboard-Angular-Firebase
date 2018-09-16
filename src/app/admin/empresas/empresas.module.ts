import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { CustonMaterialModule } from '../material.module';

import { PipesModule } from '../../pipes/pipes.module';

import { EmpresasComponent } from './empresas.component';
import { EmpresasFormComponent } from './empresas-form/empresas-form.component';
import { TagsComponent } from './tags/tags.component';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CustonMaterialModule,
    PipesModule
    //CidadesRoutingModule
  ],
  declarations: [
    EmpresasComponent,
    EmpresasFormComponent,
    TagsComponent,
    CategoriesComponent
  ]
})
export class EmpresasModule { }
