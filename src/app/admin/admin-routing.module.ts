import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { MediaComponent } from './media/media.component';

import { EmpresasComponent } from './empresas/empresas.component';
import { EmpresasFormComponent } from './empresas/empresas-form/empresas-form.component';
import { CategoriesComponent } from './empresas/categories/categories.component';
import { TagsComponent } from './empresas/tags/tags.component';

import { CidadesComponent } from './cidades/cidades.component';
import { CidadesFormComponent } from './cidades/cidades-form/cidades-form.component';

import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProfileComponent } from './usuarios/profile/profile.component';


//guard
import { AuthGuard } from '../core/auth.guard';

const adminRoutes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [{
      path: 'dashboard',
      component: DashboardComponent
    },{
      path: 'quem-somos',
      component: QuemSomosComponent
    },{
      path: 'empresas',
      component: EmpresasComponent
    },{
      path: 'nova-empresa',
      component: EmpresasFormComponent
    },{
      path: 'editar-empresa/:id',
      component: EmpresasFormComponent,
    },{
      path: 'empresa/categorias',
      component: CategoriesComponent
    },{
      path: 'empresa/tags',
      component: TagsComponent
    },{
      path: 'cidades',
      component: CidadesComponent
    },{
      path: 'nova-cidade',
      component: CidadesFormComponent,
    },{
      path: 'editar-cidade/:id',
      component: CidadesFormComponent,
    },{
      path: 'usuarios',
      component: UsuariosComponent,
    },{
      path: 'perfil',
      component: ProfileComponent,
    },{
      path: 'media',
      component: MediaComponent,
    },{
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    }],
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {
}
