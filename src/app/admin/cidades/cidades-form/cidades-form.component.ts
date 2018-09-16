import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { CidadesService } from '../../../services/cidades.service';

@Component({
  selector: 'app-cidades-form',
  templateUrl: './cidades-form.component.html',
  styleUrls: ['./cidades-form.component.scss']
})
export class CidadesFormComponent implements OnInit {
  id: string = null;
  cidadeForm: FormGroup;
  slug: string = null;

  constructor(
    private cidadesService: CidadesService,
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if(this.id) {
      this.cidadesService.getCidadeID(this.id).subscribe(data => {
        this.populateForm(data);
      });
    }
    this.cidadeForm = this.fb.group({
      title: '',
      slug: '',
      content: ''
    });
  }

  populateForm = (data) => {
    this.cidadeForm.setValue({
      title: data.title,
      slug: data.slug,
      content: data.content
    });
    this.slug = data.slug;
  }

  slugfy(event: any) {
    this.cidadeForm.patchValue({slug:
      event.target.value.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')            // Trim - from end of text
    });
  }

  salvar() {
    if(!this.id) {
      this.cidadesService.salvarCidade(this.cidadeForm);

      this.slug = '';
      this.cidadeForm.reset();
    } else {
      this.cidadesService.updateCidade(this.cidadeForm, this.id);
    }
  }

  verifyCidadeSlug(contador: number = 0) {
    if((this.cidadeForm.get('slug').value) && (this.cidadeForm.get('slug').value != this.slug)) {
      this.cidadesService.getCidade(this.cidadeForm.get('slug').value).subscribe(res=>{
        if(res[0]){
          contador++;
          if(this.cidadeForm.get('slug').value != null) {
            this.cidadeForm.patchValue({slug: this.cidadeForm.get('slug').value + "-" + contador});
            this.verifyCidadeSlug(contador);
          }
        }
      });
    }
  }
}
