import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UploadsService } from '../../../services/uploads.service';

@Component({
  selector: 'app-edit-image',
  templateUrl: './edit-image.component.html',
  styleUrls: ['./edit-image.component.scss']
})
export class EditImageComponent implements OnInit {
  fileForm: FormGroup;

  constructor(
    private uploadsService: UploadsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<EditImageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.fileForm = this.fb.group({
      title: this.data.title,
      textAlter: this.data.textAlter
    });
  }

  onNoClick(result): void {
    this.dialogRef.close();
  }

  updateFile(id: string) {
    this.uploadsService.updateFile(this.fileForm, id);
  }

  deleteFile(path: string, id: string) {
    this.uploadsService.deleteFile(path, id);
    this.dialogRef.close();
  }
}
