import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { EmpresaTagsService } from '../../../services/empresa-tags.service';
import { DialogNotifyComponent } from '../../components/dialog-notify/dialog-notify.component';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class TagsComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'slug']; //, 'content'];
  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  tagEmpresaForm: FormGroup;
  fireTags: Observable<any[]>;
  id: string = null;
  slug: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private empresaTagsService: EmpresaTagsService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.tagEmpresaForm = this.fb.group({
      title: '',
      slug: '',
      //content: ''
    });
  }

  ngAfterViewInit() {
    this.empresaTagsService.getData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  salvar() {
    if(!this.id) {
      this.empresaTagsService.salvarEmpTag(this.tagEmpresaForm);
    } else {
      this.empresaTagsService.updateEmpTag(this.tagEmpresaForm, this.id);
    }
    
    this.slug = '';
    this.tagEmpresaForm.reset();
  }

  editar(categoria: any) {
    this.tagEmpresaForm.setValue({
      title: categoria.title,
      slug: categoria.slug,
      //content: categoria.content
    });
    this.id = categoria.id;
    this.slug = categoria.slug;
  }

  deleteCategoria(id: string, title: string) {
    const dialogRef = this.dialog.open(DialogNotifyComponent, {
      data: {
        title: "Excluir",
        descript: "Tem certeza que deseja excluir",
        name: title,
        type: "danger"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.empresaTagsService.deleteEmpTag(id);

        this.slug = '';
        this.tagEmpresaForm.reset();
      }
    })
  }

  slugfy(event: any) {
    this.tagEmpresaForm.patchValue({slug:
      event.target.value.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')            // Trim - from end of text
    });
  }


  verifyTagsSlug(contador: number = 0) {
    if((this.tagEmpresaForm.get('slug').value) && (this.tagEmpresaForm.get('slug').value != this.slug)) {
      this.empresaTagsService.getEmpTag(this.tagEmpresaForm.get('slug').value).subscribe(res=>{
        if(res[0]){
          contador++;
          if(this.tagEmpresaForm.get('slug').value != null) {
            this.tagEmpresaForm.patchValue({slug:this.tagEmpresaForm.get('slug').value + "-" + contador});
            this.verifyTagsSlug(contador);
          }
        }
      });
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
