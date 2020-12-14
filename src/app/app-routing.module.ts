import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { JuegoComponent} from './../app/juego/juego.component';
import { OtherComponent} from './../app/other/other.component';

const routes: Routes = [
  { path: 'juego/:id', component: JuegoComponent },
  { path: 'other', component: OtherComponent } 
 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
