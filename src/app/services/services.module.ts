import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesService } from './pages.service';
import { CidadesService } from './cidades.service';
import { EmpresaCategoriasService } from './empresa-categorias.service';
import { EmpresaTagsService } from './empresa-tags.service';
import { EmpresasService } from './empresa.service';
import { UploadsService } from './uploads.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    CidadesService,
    PagesService,
    EmpresaCategoriasService,
    EmpresaTagsService,
    EmpresasService,
    UploadsService
  ]
})
export class ServicesModule { }
