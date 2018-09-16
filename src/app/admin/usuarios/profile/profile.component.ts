import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';

import { MatAutocompleteSelectedEvent, MatChipInputEvent, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { SelectImageComponent } from '../../components/select-image/select-image.component';

import { AuthService } from '../../../core/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  usuarioForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.usuarioForm = this.fb.group({
      nome: '',
      sobrenome: '',
      telefone: '',
      photoURL: ''
    });
    this.auth.user.subscribe(data =>{
      this.usuarioForm.setValue({
        nome: data.nome,
        sobrenome: data.sobrenome,
        telefone: data.telefone,
        photoURL: data.photoURL
      })
    });
  }

  selectFile(type: boolean, content: any = null) {
    const dialogRef = this.dialog.open(SelectImageComponent, {
      width: '80vw',
      data: {
        type: type,
        content: content
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.usuarioForm.patchValue({photoURL: result});
    })
  }

  salvar() {
    this.auth.user.subscribe(data => {
      this.auth.updateUser(this.usuarioForm, data.uid);
    });
  }
}
