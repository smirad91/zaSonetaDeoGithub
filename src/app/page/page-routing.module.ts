import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MachinesComponent } from 'app/performance-metric/machines/machines.component';

const routes: Routes = [
  {
    path: '',

    // component: PageComponent,
    // data: {
    //   title: 'Page'
    // },
    children: [
   
      {
        path: 'machines',
        component: MachinesComponent,
        data: {
          title: 'Execution single'
        }
      },
     
   
    

      
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PageRoutingModule { }
