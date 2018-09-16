import { Component, Inject } from '@angular/core';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  title: string;
  descript: string;
  name: string;
  type: string;
}

@Component({
  selector: 'app-dialog-notify',
  templateUrl: './dialog-notify.component.html',
  styleUrls: ['./dialog-notify.component.scss']
})
export class DialogNotifyComponent {

  constructor(
    public dialogRef: MatDialogRef<DialogNotifyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(result: boolean): void {
    this.dialogRef.close(result);
  }
}
