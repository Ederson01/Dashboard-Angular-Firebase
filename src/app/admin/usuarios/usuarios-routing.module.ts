import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';



const userRoutes = [
  
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule],
})
export class CidadesRoutingModule {
}
