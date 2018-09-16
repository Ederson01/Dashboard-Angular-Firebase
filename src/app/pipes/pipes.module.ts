import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlugPipe } from './slug.pipe';
import { ExcerptPipe } from './excerpt.pipe';
import { FileSizePipe } from './file-size.pipe';

@NgModule({
  declarations: [
    SlugPipe,
    ExcerptPipe,
    FileSizePipe
  ],
  imports: [
    CommonModule
  ],
  providers: [
  ],
  exports: [
    SlugPipe,
    ExcerptPipe,
    FileSizePipe
  ]
})
export class PipesModule { }
