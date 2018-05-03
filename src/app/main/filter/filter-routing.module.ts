import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterComponent}     from './filter.component';
import { NewFilterComponent }   from './new-filter/new-filter.component';
import { CurrentFilterComponent } from './current-filter/current-filter.component';
import { KeywordSuggestionComponent } from './keyword-suggest/keyword-suggest.component';

const mainRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        component : FilterComponent
      },
      {
        path: 'newFilter',
        component : NewFilterComponent
      },
      {
        path : 'currentFilter',
        component : CurrentFilterComponent
      },
      {
        path : 'keywordSuggest',
        component : KeywordSuggestionComponent
      }
    ] 
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(mainRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class FilterRoutingModule { }