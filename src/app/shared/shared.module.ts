import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ToastComponent } from './components/toast/toast.component';
import { LoaderComponent } from './components/loader/loader.component';

const COMPONENTS = [HeaderComponent, SidebarComponent, ToastComponent, LoaderComponent];

@NgModule({
  declarations: COMPONENTS,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  exports: [...COMPONENTS, CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
})
export class SharedModule {}
