import { NgModule }               from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { HelpComponent }          from './help.component';
import { GettingStartedComponent} from './gettingStarted/gettingStarted.component';
import { FeedbackComponent }      from './feedback/feedback.component';
import { AboutComponent }         from './about/about.component';

const helpRoutes: Routes = [
  {
    path: '',
    children : [
      {
        path: '',
        component : HelpComponent,
      },
      {
        path: 'gettingStarted',
        component : GettingStartedComponent
      },
      {
        path : 'feedback',
        component : FeedbackComponent
      },
      {
        path : 'about',
        component : AboutComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(helpRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class HelpRoutingModule { }