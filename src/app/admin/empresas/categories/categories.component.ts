import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { EmpresaCategoriasService } from '../../../services/empresa-categorias.service';
import { DialogNotifyComponent } from '../../components/dialog-notify/dialog-notify.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CategoriesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['title', 'slug', 'content'];
  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  categoryEmpresaForm: FormGroup;
  fireCategorias: Observable<any[]>;
  id: string = null;
  slug: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private empresaCategoriasService: EmpresaCategoriasService,
    public dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.categoryEmpresaForm = this.fb.group({
      title: '',
      slug: '',
      content: ''
    });
  }

  ngAfterViewInit() {
    this.empresaCategoriasService.getData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  salvar() {
    if(!this.id) {
      this.empresaCategoriasService.salvarEmpCategory(this.categoryEmpresaForm);
    } else {
      this.empresaCategoriasService.updateEmpCategory(this.categoryEmpresaForm, this.id);
    }

    this.slug = '';
    this.categoryEmpresaForm.reset();
  }

  editar(categoria: any) {
    this.categoryEmpresaForm.setValue({
      title: categoria.title,
      slug: categoria.slug,
      content: categoria.content
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
        this.empresaCategoriasService.deleteEmpCategory(id);
        this.slug = '';
        this.categoryEmpresaForm.reset();
      }
    })
  }

  slugfy(event: any) {
    this.categoryEmpresaForm.patchValue({slug:
      event.target.value.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '')            // Trim - from end of text
    });
  }


  verifyCategorySlug(contador: number = 0) {
    if((this.categoryEmpresaForm.get('slug').value) && (this.categoryEmpresaForm.get('slug').value != this.slug)) {
      this.empresaCategoriasService.getEmpCategory(this.categoryEmpresaForm.get('slug').value).subscribe(res=>{
        if(res[0]){
          contador++;
          if(this.categoryEmpresaForm.get('slug').value != null) {
            this.categoryEmpresaForm.patchValue({slug:this.categoryEmpresaForm.get('slug').value + "-" + contador});
            this.verifyCategorySlug(contador);
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
