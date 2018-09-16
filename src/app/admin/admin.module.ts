import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//Plugins
import { PerfectScrollbarModule, PerfectScrollbarConfigInterface, PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { CustonMaterialModule } from './material.module';
import { FileDropModule } from 'ngx-file-drop';

//Rotas
import { AdminRoutingModule } from './admin-routing.module';

//Modules
import { CidadesModule } from './cidades/cidades.module';
import { EmpresasModule } from './empresas/empresas.module';
import { UsuariosModule } from './usuarios/usuarios.module';

//Components
import { ComponentsModule } from './components/components.module';

//Pipes
import { PipesModule } from '../pipes/pipes.module';

//Pages
import { AdminComponent } from './admin.component';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { QuemSomosComponent } from './quem-somos/quem-somos.component';
import { MediaComponent } from './media/media.component';

@NgModule({
  declarations: [
    AdminComponent,
    LoginComponent,
    DashboardComponent,
    QuemSomosComponent,
    MediaComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ComponentsModule,
    CidadesModule,
    EmpresasModule,
    UsuariosModule,
    CustonMaterialModule,
    AdminRoutingModule,
    PipesModule,
    FileDropModule
  ],
  providers: [
  ]
})
export class AdminModule { }
