import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";

import { PageRoutingModule } from "./page-routing.module";

import { PageComponent } from "./page.component";
import { NgSelectModule } from '@ng-select/ng-select';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthGuard } from 'app/shared/auth/auth-guard.service';


@NgModule({
  imports: [
    CommonModule,
    PageRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule
  ],
  exports: [],
  declarations: [
    PageComponent
  ],
  providers: [AuthGuard],
  // schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class PageModule { }
