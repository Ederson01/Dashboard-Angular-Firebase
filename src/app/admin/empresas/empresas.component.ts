import { Component, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { EmpresasService } from '../../services/empresa.service';
import { DialogNotifyComponent } from '../components/dialog-notify/dialog-notify.component';

@Component({
  selector: 'app-empresas',
  templateUrl: './empresas.component.html',
  styleUrls: ['./empresas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0', display: 'none'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EmpresasComponent {
  displayedColumns: string[] = ['title', 'slug', 'email', 'pagante', 'empresaCapa', 'propaganda'];
  dataSource: MatTableDataSource<any>;
  expandedElement: any;

  fireCategorias: Observable<any[]>;
  id: string = null;
  slug: string = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private empresasService: EmpresasService,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngAfterViewInit() {
    this.empresasService.getData().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editarEmpresa(empresaId: string){
    this.router.navigate(['/admin/editar-empresa', empresaId]);
  }

  deleteEmpresa(id: string, empresaTitle: string) {
    const dialogRef = this.dialog.open(DialogNotifyComponent, {
      data: {
        title: "Excluir",
        descript: "Tem certeza que deseja excluir",
        name: empresaTitle,
        type: "danger"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.empresasService.deleteEmpresa(id);
    })
  }
}
