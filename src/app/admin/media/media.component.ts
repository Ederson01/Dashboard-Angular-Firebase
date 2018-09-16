import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { UploadEvent, UploadFile } from 'ngx-file-drop';

import { UploadsService } from '../../services/uploads.service';
import { EditImageComponent } from '../components/edit-image/edit-image.component';

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {
  isHovering: boolean;
  files: Observable<any[]>;
  fileList: any[];

  constructor(
    private uploadsService: UploadsService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.files = this.uploadsService.getData();
  }

  startUpload(event) {
    this.uploadsService.uploadInput('files', event.files);
  }

  infoFile(file: any) {
    const dialogRef = this.dialog.open(EditImageComponent, {
      width: '80vw',
      data: file
    });
    dialogRef.afterClosed();
  }

  dropped(event: any) {
    let cont: number = 0;
    this.fileList = [];

    for (const droppedFile of event.files) {
      cont++;
      const fileEntry = droppedFile.fileEntry;

      if(event.files.length != cont) {
        fileEntry.file((file: File) => {
          this.fileList.push(file)
        });
      } else {
        fileEntry.file((file: File) => {
          this.fileList.push(file)
          this.uploadsService.uploadInput('files', this.fileList);
        });
      }
    }
  }
}
