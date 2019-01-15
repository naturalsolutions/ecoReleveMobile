import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProjectsPage } from './projects';
//import { ComponentsModule } from '../components/components.module';

@NgModule({
  declarations: [
    ProjectsPage,
  ],
  imports: [
    //ComponentsModule,
    IonicPageModule.forChild(ProjectsPage)
  ],
  exports: [
    ProjectsPage
  ]
})
export class ProjectsPageModule {}
