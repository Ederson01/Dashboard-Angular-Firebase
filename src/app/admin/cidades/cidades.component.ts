import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import { CidadesService } from '../../services/cidades.service';
import { DialogNotifyComponent } from '../components/dialog-notify/dialog-notify.component';

@Component({
  selector: 'app-cidades',
  templateUrl: './cidades.component.html',
  styleUrls: ['./cidades.component.scss']
})
export class CidadesComponent implements OnInit {
  cidades: Observable<any[]>;
  constructor(private cidadesService: CidadesService, public dialog: MatDialog, private router: Router) { }

  ngOnInit() {
    this.cidades = this.cidadesService.getData();
  }

  editarCidade(cidadeId: string){
    this.router.navigate(['/admin/editar-cidade', cidadeId]);
  }
  deleteCidade(id: string, cidadeTitle: string) {
    const dialogRef = this.dialog.open(DialogNotifyComponent, {
      data: {
        title: "Excluir",
        descript: "Tem certeza que deseja excluir",
        name: cidadeTitle,
        type: "danger"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.cidadesService.deleteCidade(id);
    })
  }
}
