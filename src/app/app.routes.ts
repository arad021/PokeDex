import { Routes } from '@angular/router';
import {IndexComponent} from "./index/index.component";
import {DetailedComponent} from "./detailed/detailed.component";

export const routes: Routes = [

  {
    path: '',
    component: IndexComponent
  },
  {
    path: 'pokemon/:pokemonName',
    component: DetailedComponent
  },

];
