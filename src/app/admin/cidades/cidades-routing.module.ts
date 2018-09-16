import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { CidadesComponent } from './cidades.component';
import { CidadesFormComponent } from './cidades-form/cidades-form.component';

const cidadesRoutes = [
  {
    path: 'cidades',
    component: CidadesComponent,
    children: [{
      path: 'novo',
      component: CidadesFormComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(cidadesRoutes)],
  exports: [RouterModule],
})
export class CidadesRoutingModule {
}
