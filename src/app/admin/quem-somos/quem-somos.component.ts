import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

import { PagesService } from '../../services/pages.service';

@Component({
  selector: 'app-quem-somos',
  templateUrl: './quem-somos.component.html',
  styleUrls: ['./quem-somos.component.scss']
})
export class QuemSomosComponent implements OnInit {
  pageForm: FormGroup;
  pageName: string = "quem-somos";

  constructor(private pagesService: PagesService, private fb: FormBuilder) { }

  ngOnInit() {
    this.pagesService.getPage(this.pageName).subscribe(data => {
      this.populateForm(data);
    });

    this.pageForm = this.fb.group({
      title: '',
      content: ''
    });
  }
  populateForm = (data) => {
    this.pageForm.setValue({
      title: data.title,
      content: data.content
    });
  }
  salvar() {
    this.pagesService.salvarPages(this.pageName, this.pageForm);
  }
}
